from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import Response
import os
import time
import uuid
import json
import sqlite3
import asyncio
import ipaddress
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
from sync_models import sync_models
from typing import List, Optional, Dict, Any

load_dotenv()

app = FastAPI()
sync_models()


def load_models():
    with open("data/models.json", "r") as f:
        return json.load(f)["models"]

MODELS = load_models()

def get_model_info(model_id: str):
    clean_id = model_id.split(":", 1)[-1]
    return next((m for m in MODELS if m["model_id"] == clean_id), None)



def validate_custom_base_url(base_url: str):
    parsed = urlparse(base_url)

    if parsed.scheme != "https":
        raise ValueError("Custom endpoint must use HTTPS")

    if not parsed.hostname:
        raise ValueError("Invalid custom endpoint URL")

    hostname = parsed.hostname.lower()

    if hostname == "localhost" or hostname.endswith(".localhost"):
        raise ValueError("Localhost endpoints are not allowed")

    try:
        addresses = socket.getaddrinfo(hostname, parsed.port or 443)
    except socket.gaierror as error:
        raise ValueError("Custom endpoint hostname could not be resolved") from error

    for address in addresses:
        ip_text = address[4][0]
        ip = ipaddress.ip_address(ip_text)

        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        ):
            raise ValueError("Private or local endpoint addresses are not allowed")

    return base_url.rstrip("/")

def get_client(provider: str):
    if provider == "openai":
        return OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url="https://api.openai.com/v1"
        )

    if provider == "nvidia":
        return OpenAI(
            api_key=os.getenv("NVIDIA_API_KEY"),
            base_url="https://integrate.api.nvidia.com/v1"
        )

    if provider == "groq":
        return OpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )

    raise Exception(f"Unknown provider: {provider}")

#For frontend
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://llm-comparison-git-main-buttery-ai-internship.vercel.app"
).rstrip("/")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS comparisons (
            comparison_id TEXT PRIMARY KEY,
            title TEXT,
            notes TEXT,
            is_public INTEGER,
            created_at TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_requests (
            request_id TEXT PRIMARY KEY,
            comparison_id TEXT,

            prompt TEXT,
            system_prompt TEXT,
            model_ids TEXT,

            temperature REAL,
            max_tokens INTEGER,
            top_p REAL,

            per_model_overrides TEXT,
            created_at TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT,

            model_id TEXT,
            text TEXT,
            tokens_in INTEGER,
            tokens_out INTEGER,
            latency_ms INTEGER,
            cost_cents REAL,
            error TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS privateKey (
            comparison_id TEXT PRIMARY KEY,
            key TEXT
        )
        """)

        conn.commit()


init_db()

# ERROR STRUCTURE
def error_response(code: str, message: str, details: Optional[Dict[str, Any]] = None):
    return {
        "error": {
            "code": code,
            "message": message,
            "details": details or {}
        }
    }

def api_error(status_code: int, code: str, message: str, details=None):
    return JSONResponse(
        status_code=status_code,
        content=error_response(code, message, details)
    )

# MODELS ENDPOINT
@app.get("/api/models")
def get_models():

    formatted_json = json.dumps(
        MODELS,
        indent=4,
        ensure_ascii=False
    )

    return Response(
        content=formatted_json,
        media_type="application/json"
    )

# SCHEMAS
class ChatParams(BaseModel):
    temperature: float
    max_tokens: int
    top_p: float

class CustomEndpoint(BaseModel):
    base_url: str
    api_key: str
    model_id: str

class ChatRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    model_ids: List[str]
    params: ChatParams
    per_model_overrides: Optional[Dict[str, Any]] = None
    custom_endpoints: Optional[Dict[str, CustomEndpoint]] = None

class ComparisonCreateRequest(BaseModel):
    request_id: str
    title: str
    notes: str
    is_public: bool
    key: str

# MODEL RUNNER
# MODEL RUNNER
async def run_model(model_id: str, request: ChatRequest):

    start_time = time.time()

    print(f"[run_model] Starting model: {model_id}")

    model_info = get_model_info(model_id)
    custom_endpoint = None

    if request.custom_endpoints:
        custom_endpoint = request.custom_endpoints.get(model_id)

    try:
        if custom_endpoint:
            safe_base_url = validate_custom_base_url(custom_endpoint.base_url)

            client = OpenAI(
                api_key=custom_endpoint.api_key,
                base_url=safe_base_url
            )

            actual_model_id = custom_endpoint.model_id
            input_cost_rate = 0
            output_cost_rate = 0

        elif model_info:
            client = get_client(model_info["provider"])
            actual_model_id = model_info["model_id"]
            input_cost_rate = model_info.get(
                "input_cost_per_million_tokens_cents",
                0
            )
            output_cost_rate = model_info.get(
                "output_cost_per_million_tokens_cents",
                0
            )

        else:
            return {
                "model_id": model_id,
                "text": None,
                "tokens_in": 0,
                "tokens_out": 0,
                "latency_ms": 0,
                "cost_cents": 0,
                "error": {
                    "type": "MODEL_NOT_FOUND",
                    "message": f"Unknown model: {model_id}"
                }
            }

        override_system_prompt = None
        override_temp = None
        override_max_tokens = None
        override_top_p = None

        if request.per_model_overrides:
            overrides = request.per_model_overrides.get(model_id, {})
            override_system_prompt = overrides.get("system_prompt")
            override_temp = overrides.get("temperature")
            override_max_tokens = overrides.get("max_tokens")
            override_top_p = overrides.get("top_p")

        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=actual_model_id,
            messages=[
                {
                    "role": "system",
                    "content": (
                        override_system_prompt
                        or request.system_prompt
                        or "You are a helpful assistant. Answer clearly and concisely"
                    )
                },
                {
                    "role": "user",
                    "content": request.prompt
                }
            ],
            temperature=(
                override_temp
                if override_temp is not None
                else request.params.temperature
            ),
            max_tokens=(
                override_max_tokens
                if override_max_tokens is not None
                else request.params.max_tokens
            ),
            top_p=(
                override_top_p
                if override_top_p is not None
                else request.params.top_p
            )
        )

        text = response.choices[0].message.content

        usage = getattr(response, "usage", None)
        tokens_in = getattr(usage, "prompt_tokens", 0) or 0
        tokens_out = getattr(usage, "completion_tokens", 0) or 0
        latency_ms = int((time.time() - start_time) * 1000)

        cost_in = (tokens_in / 1_000_000) * input_cost_rate
        cost_out = (tokens_out / 1_000_000) * output_cost_rate

        return {
            "model_id": model_id,
            "text": text,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "latency_ms": latency_ms,
            "cost_cents": cost_in + cost_out,
            "error": None
        }

    except Exception as e:
        print("[run_model] EXCEPTION!")
        print(type(e).__name__)
        print(str(e))

        return {
            "model_id": model_id,
            "text": None,
            "tokens_in": 0,
            "tokens_out": 0,
            "latency_ms": int((time.time() - start_time) * 1000),
            "cost_cents": 0,
            "error": {
                "type": type(e).__name__,
                "message": str(e)
            }
        }

# CHAT ENDPOINT
@app.post("/api/chat")
async def chat(request: ChatRequest):

    request_id = str(uuid.uuid4())
    comparison_id = request_id
    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    print("[chat] Creating tasks...")

    tasks = [
        run_model(model_id, request)
        for model_id in request.model_ids
    ]


    print("[chat] Waiting for asyncio.gather...")

    responses = await asyncio.gather(*tasks)

    print("[chat] Gather finished!")
    print("[chat] Writing to database...")

    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT OR REPLACE INTO comparisons (
                comparison_id, title, notes, is_public, created_at
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            comparison_id,
            "untitled",
            "",
            0,
            created_at
        ))

        cursor.execute("""
            INSERT OR REPLACE INTO chat_requests (
                request_id, comparison_id,
                prompt, system_prompt, model_ids,
                temperature, max_tokens, top_p,
                per_model_overrides, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            request_id,
            comparison_id,
            request.prompt,
            request.system_prompt,
            json.dumps(request.model_ids),
            request.params.temperature,
            request.params.max_tokens,
            request.params.top_p,
            json.dumps(request.per_model_overrides),
            created_at
        ))

        for r in responses:
            print(f"[chat] Saving response for {r['model_id']}")

            cursor.execute("""
                INSERT OR REPLACE INTO chat_responses (
                    request_id, model_id, text,
                    tokens_in, tokens_out,
                    latency_ms, cost_cents, error
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                request_id,
                r["model_id"],
                r["text"],
                r["tokens_in"],
                r["tokens_out"],
                r["latency_ms"],
                r["cost_cents"],
                json.dumps(r["error"]) if r["error"] else None
            ))

        conn.commit()

    print("[chat] Database commit complete")

    return {
        "request_id": request_id,
        "created_at": created_at,
        "responses": responses
    }

# CREATE COMPARISON
@app.post("/api/comparisons")
def create_comparison(request: ComparisonCreateRequest):

    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()
        comparison_id = request.request_id

        cursor.execute("""
            INSERT OR REPLACE INTO comparisons (
                comparison_id, title, notes, is_public, created_at
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            comparison_id,
            request.title,
            request.notes,
            int(request.is_public),
            created_at
        ))

        cursor.execute("""
            INSERT OR REPLACE INTO privateKey (
                comparison_id, key
            )
            VALUES (?, ?)
        """, (
            comparison_id,
            request.key
        ))

        conn.commit()

    return {
        "comparison_id": comparison_id,
        "share_url": f"https://llm-playground-lvj1.onrender.com/api/comparisons/{comparison_id}",
        "created_at": created_at
    }


def get_comparison_data(comparison_id: str, provided_key: Optional[str] = None):

    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT title, notes, is_public, created_at
            FROM comparisons
            WHERE comparison_id = ?
        """, (comparison_id,))

        comp = cursor.fetchone()

        if not comp:
            return api_error(404, "NOT_FOUND", "Comparison not found")

        title, notes, is_public, created_at = comp

        if is_public != 1:
            cursor.execute("""
                SELECT key
                FROM privateKey
                WHERE comparison_id = ?
            """, (comparison_id,))

            current_key_row = cursor.fetchone()

            if not current_key_row:
                return api_error(403, "FORBIDDEN", "No private key exists for this comparison")

            current_key = current_key_row[0]

            if provided_key != current_key:
                return api_error(403, "FORBIDDEN", "Invalid key, comparison is private")

        cursor.execute("""
            SELECT request_id, prompt, system_prompt, model_ids,
                   temperature, max_tokens, top_p, per_model_overrides
            FROM chat_requests
            WHERE comparison_id = ?
            ORDER BY created_at DESC
        """, (comparison_id,))

        request_rows = cursor.fetchall()

        requests = []
        response_groups = []

        for row in request_rows:
            request_id = row[0]

            cursor.execute("""
                SELECT model_id, text, tokens_in, tokens_out,
                       latency_ms, cost_cents, error
                FROM chat_responses
                WHERE request_id = ?
            """, (request_id,))

            response_rows = cursor.fetchall()

            requests.append({
                "request_id": request_id,
                "prompt": row[1],
                "system_prompt": row[2],
                "model_ids": json.loads(row[3]),
                "params": {
                    "temperature": row[4],
                    "max_tokens": row[5],
                    "top_p": row[6]
                },
                "per_model_overrides": json.loads(row[7]) if row[7] else {}
            })

            response_groups.append([
                {
                    "model_id": response_row[0],
                    "text": response_row[1],
                    "tokens_in": response_row[2],
                    "tokens_out": response_row[3],
                    "latency_ms": response_row[4],
                    "cost_cents": response_row[5],
                    "error": json.loads(response_row[6]) if response_row[6] else None
                }
                for response_row in response_rows
            ])

    return {
        "comparison_id": comparison_id,
        "title": title,
        "notes": notes,
        "is_public": bool(is_public),
        "request": requests,
        "responses": response_groups,
        "created_at": created_at
    }


# PUBLIC COMPARISON LINK
@app.get("/api/comparisons/{comparison_id}")
def get_public_comparison(comparison_id: str):
    return get_comparison_data(comparison_id)


# PRIVATE COMPARISON LINK
@app.get("/api/comparisons/{comparison_id}/{key}")
def get_private_comparison(comparison_id: str, key: str):
    return get_comparison_data(comparison_id, key)


@app.get("/api/prevcompare")
def list_comparisons():

    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT comparison_id, title, created_at
            FROM comparisons
            WHERE is_public = 1
            ORDER BY created_at DESC
        """)

        rows = cursor.fetchall()

        result = []

        for comparison_id, title, created_at in rows:

            cursor.execute("""
                SELECT model_ids, prompt
                FROM chat_requests
                WHERE comparison_id = ?
            """, (comparison_id,))

            row = cursor.fetchone()

            ids = json.loads(row[0]) if row else []
            prompt = row[1] if row else ""

            # Create a shorter prompt preview
            if len(prompt) > 80:
                prompt_preview = prompt[:80] + "..."
            else:
                prompt_preview = prompt

            result.append({
                "comparison_id": comparison_id,
                "title": title,
                "created_at": created_at,
                "model_count": len(ids),
                "model_ids": ids,
                "prompt_preview": prompt_preview
            })

    output = {
        "comparisons": result,
        "next_cursor": None
    }

    # Convert the Python dictionary into formatted JSON
    formatted_json = json.dumps(
        output,
        indent=4,
        ensure_ascii=False
    )

    return Response(
        content=formatted_json,
        media_type="application/json"
    )

@app.post("/api/deletecompare") # Delete comparison by ID
def delete_comparison(comparison_id: str):
    try:
        with sqlite3.connect("comparisons.db") as conn:
            cursor = conn.cursor()

            # Find related request IDs first because responses use request_id
            cursor.execute(
                """
                SELECT request_id
                FROM chat_requests
                WHERE comparison_id = ?
                """,
                (comparison_id,)
            )

            request_ids = cursor.fetchall()

            for request_row in request_ids:
                cursor.execute(
                    """
                    DELETE FROM chat_responses
                    WHERE request_id = ?
                    """,
                    (request_row[0],)
                )

            cursor.execute(
                """
                DELETE FROM chat_requests
                WHERE comparison_id = ?
                """,
                (comparison_id,)
            )

            cursor.execute(
                """
                DELETE FROM privateKey
                WHERE comparison_id = ?
                """,
                (comparison_id,)
            )

            cursor.execute(
                """
                DELETE FROM comparisons
                WHERE comparison_id = ?
                """,
                (comparison_id,)
            )

            deleted_rows = cursor.rowcount

            if deleted_rows == 0:
                return api_error(
                    404,
                    "NOT_FOUND",
                    "Comparison not found"
                )

            conn.commit()

        return {
            "success": True,
            "comparison_id": comparison_id,
            "message": "Comparison deleted"
        }

    except sqlite3.Error as error:
        return api_error(
            500,
            "DATABASE_ERROR",
            "Unable to delete comparison",
            {"message": str(error)}
        )

@app.delete("/api/comparisons")
def delete_all_comparisons():
    try:
        with sqlite3.connect("comparisons.db") as conn:
            cursor = conn.cursor()

            cursor.execute("DELETE FROM chat_responses")
            cursor.execute("DELETE FROM chat_requests")
            cursor.execute("DELETE FROM privateKey")
            cursor.execute("DELETE FROM comparisons")

            conn.commit()

        return {
            "success": True,
            "message": "All comparisons deleted"
        }

    except sqlite3.Error as error:
        return api_error(
            500,
            "DATABASE_ERROR",
            "Unable to delete all comparisons",
            {"message": str(error)}
        )
