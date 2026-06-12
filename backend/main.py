# Import FastAPI so we can create a web server
from fastapi import FastAPI

# Import tools for loading environment variables
import os
from dotenv import load_dotenv

# Import the OpenAI-compatible client
from openai import OpenAI

# Load variables from .env
load_dotenv()

# Create the FastAPI app
app = FastAPI()

# Create the AI client
client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url="https://integrate.api.nvidia.com/v1"
)

# Simple homepage so we know the server is running
@app.get("/")
def home():
    return {"message": "Backend is running"}


# Test endpoint that sends a message to the AI model
@app.get("/test")
def test():

    # Send a prompt to the model
    response = client.chat.completions.create(
        model="meta/llama-3.1-8b-instruct",
        messages=[
            {
                "role": "user",
                "content": "Hello, who are you?"
            }
        ]
    )

    # Return the model's response
    return {
        "reply": response.choices[0].message.content
    }