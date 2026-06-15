from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
import time
import uuid
import json
import sqlite3
import asyncio
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
from typing import List, Optional, Dict, Any

load_dotenv()

def load_models():
    with open("data/models.json", "r") as f:
        return json.load(f)["models"]

MODELS = load_models()

def get_model_info(model_id: str):
    clean_id = model_id.split(":", 1)[-1]
    return next((m for m in MODELS if m["model_id"] == clean_id), None)

client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url="https://integrate.api.nvidia.com/v1"
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

        conn.commit()


app = FastAPI()
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
    return {"models": MODELS}

# SCHEMAS
class ChatParams(BaseModel):
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 0.9

class ChatRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    model_ids: List[str]
    params: ChatParams
    per_model_overrides: Dict[str, Any] = {}

class ComparisonCreateRequest(BaseModel):
    request_id: str
    title: str
    notes: str
    is_public: bool

# MODEL RUNNER
async def run_model(model_id: str, request: ChatRequest, start_time: float):

    model_info = get_model_info(model_id)

    if not model_info:
        return {
            "model_id": model_id,
            "text": None,
            "tokens_in": 0,
            "tokens_out": 0,
            "latency_ms": 0,
            "cost_cents": 0,
            "error": "INVALID_MODEL_ID"
        }

    try:
        overrides = request.per_model_overrides.get(model_id, {})

        response = client.chat.completions.create(
            model=model_info["model_id"],
            messages=[
                {"role": "system", "content": request.system_prompt or ""},
                {"role": "user", "content": request.prompt}
            ],
            temperature=overrides.get("temperature", request.params.temperature),
            max_tokens=overrides.get("max_tokens", request.params.max_tokens),
            top_p=overrides.get("top_p", request.params.top_p)
        )

        text = response.choices[0].message.content

        tokens_in = response.usage.prompt_tokens
        tokens_out = response.usage.completion_tokens
        latency_ms = int((time.time() - start_time) * 1000)

        model_info["input_cost_per_million_tokens_cents"] = model_info.get("input_cost_per_million_tokens_cents", 0)
        model_info["output_cost_per_million_tokens_cents"] = model_info.get("output_cost_per_million_tokens_cents", 0)

        cost_in = (tokens_in / 1_000_000) * model_info["input_cost_per_million_tokens_cents"]
        cost_out = (tokens_out / 1_000_000) * model_info["output_cost_per_million_tokens_cents"]

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

    start_time = time.time()

    tasks = [
        run_model(model_id, request, start_time)
        for model_id in request.model_ids
    ]

    responses = await asyncio.gather(*tasks)

    with sqlite3.connect("comparisons.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT OR IGNORE INTO comparisons (
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

        conn.commit()

    return {
        "comparison_id": comparison_id,
        "share_url": f"https://your-app.com/c/{comparison_id}",
        "created_at": created_at,
    }

# COMPARISON FROM ID
@app.get("/api/comparisons/{comparison_id}")
def get_comparison(comparison_id: str):

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

    return {
        "comparison_id": comparison_id,
        "title": title,
        "notes": notes,
        "request": request,
        "responses": response,
        "created_at": created_at,
    }

# LIST COMPARISONS
@app.get("/api/comparisons")
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
            model_count = len(ids)
            prompt = row[1] if row else ""

            result.append({
                "comparison_id": comparison_id,
                "title": title,
                "created_at": created_at,
                "model_count": model_count,
                "prompt_preview": prompt[:30]
            })

    return {
        "comparisons": result,
        "next_cursor": None
    }