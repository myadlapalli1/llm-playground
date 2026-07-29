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

class ChatRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    model_ids: List[str]
    params: ChatParams
    per_model_overrides: Optional[Dict[str, Any]] = None

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

    # Look up the model in models.json
    model_info = get_model_info(model_id)

    override_temp = None
    override_max_tokens = None
    override_top_p = None

    if model_info is None:
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

    # Create the correct client based on the provider
    client = get_client(model_info["provider"])

    override_system_prompt = None
    override_temp = None
    override_max_tokens = None
    override_top_p = None

    try:

        if request.per_model_overrides:
            overrides = request.per_model_overrides.get(model_id, {})
            override_system_prompt = overrides.get("system_prompt")
            override_temp = overrides.get("temperature")
            override_max_tokens = overrides.get("max_tokens")
            override_top_p = overrides.get("top_p")

        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=model_info["model_id"],
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
                
        print("[run_model] NVIDIA API returned successfully!")

        text = response.choices[0].message.content

        print("[run_model] Extracted response text")

        tokens_in = response.usage.prompt_tokens
        tokens_out = response.usage.completion_tokens
        latency_ms = int((time.time() - start_time) * 1000)

        model_info["input_cost_per_million_tokens_cents"] = model_info.get(
            "input_cost_per_million_tokens_cents", 0
        )
        model_info["output_cost_per_million_tokens_cents"] = model_info.get(
            "output_cost_per_million_tokens_cents", 0
        )

        cost_in = (
            tokens_in / 1_000_000
        ) * model_info["input_cost_per_million_tokens_cents"]

        cost_out = (
            tokens_out / 1_000_000
        ) * model_info["output_cost_per_million_tokens_cents"]

        print("[run_model] Returning successful response")

        return {
            "model_id": model_info["model_id"],
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
            "model_id": model_info["model_id"],
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
        """,
        (
            comparison_id,
            request.key,
        ))

        conn.commit()

    return {
        "comparison_id": comparison_id,
        "share_url": f"http://127.0.0.1:8000/api/comparisons/{comparison_id}",
        "created_at": created_at,
    }

# COMPARISON FROM ID
@app.get("/api/comparisons/{comparison_id}/{key}")
def get_comparison(comparison_id: str, key: str = None):

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

        cursor.execute("""
            SELECT request_id, prompt, system_prompt, model_ids,
                   temperature, max_tokens, top_p, per_model_overrides
            FROM chat_requests
            WHERE comparison_id = ?
            ORDER BY created_at DESC
        """, (comparison_id,))

        requests = cursor.fetchall()

        request = []
        response = []

        for r in requests:
            request_id = r[0]

            cursor.execute("""
                SELECT model_id, text, tokens_in, tokens_out,
                       latency_ms, cost_cents, error
                FROM chat_responses
                WHERE request_id = ?
            """, (request_id,))

            responses = cursor.fetchall()

            request.append({
                "request_id": request_id,
                "prompt": r[1],
                "system_prompt": r[2],
                "model_ids": json.loads(r[3]),
                "params": {
                    "temperature": r[4],
                    "max_tokens": r[5],
                    "top_p": r[6]
                },
                "per_model_overrides": json.loads(r[7]) if r[7] else {},
            })
            response.append([
                {
                    "model_id": row[0],
                    "text": row[1],
                    "tokens_in": row[2],
                    "tokens_out": row[3],
                    "latency_ms": row[4],
                    "cost_cents": row[5],
                    "error": row[6]
                }
                for row in responses
            ])

    if (is_public == 1):
        return {
            "comparison_id": comparison_id,
            "title": title,
            "notes": notes,
            "request": request,
            "responses": response,
            "created_at": created_at,
        }
    else:
        cursor.execute("""
            SELECT key
            FROM privateKey
            WHERE comparison_id = ?
        """, (comparison_id,))

        currentKey = cursor.fetchone()

        if (key == currentKey[0]):
            return {
                "comparison_id": comparison_id,
                "title": title,
                "notes": notes,
                "request": request,
                "responses": response,
                "created_at": created_at,
            }
        else:
            return api_error(403, "FORBIDDEN", "Invalid key, comparsion is private")


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
