import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()


def fetch_models(provider, url, api_key):

    try:
        response = requests.get(
            url,
            headers={
                "Authorization": f"Bearer {api_key}"
            },
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        models = []

        for model in data.get("data", []):

            models.append({
                "provider": provider,
                "model_id": model["id"],
                "display_name": model["id"],
                "context_window": 0,
                "input_cost_per_million_tokens_cents": 0,
                "output_cost_per_million_tokens_cents": 0,
                "supports_streaming": True,
                "supports_tools": False
            })

        return models

    except Exception as e:
        print(
            f"Failed loading {provider} models:",
            e
        )
        return []


def sync_models():

    all_models = []


    # GROQ
    all_models += fetch_models(
        "groq",
        "https://api.groq.com/openai/v1/models",
        os.getenv("GROQ_API_KEY")
    )


    # NVIDIA
    all_models += fetch_models(
        "nvidia",
        "https://integrate.api.nvidia.com/v1/models",
        os.getenv("NVIDIA_API_KEY")
    )


    # OPENAI
    all_models += fetch_models(
        "openai",
        "https://api.openai.com/v1/models",
        os.getenv("OPENAI_API_KEY")
    )


    os.makedirs(
        "data",
        exist_ok=True
    )


    with open(
        "data/models.json",
        "w"
    ) as f:

        json.dump(
            {
                "models": all_models
            },
            f,
            indent=2
        )


    print(
        f"Saved {len(all_models)} models"
    )


if __name__ == "__main__":
    sync_models()