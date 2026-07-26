import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()


# ============================================================
# KNOWN TEXT-GENERATION MODEL NAMES
# ============================================================

# These terms identify model families that are commonly used for
# text input and text output.
#
# The model only needs to contain one of these terms to pass this
# first text-model check.
KNOWN_TEXT_MODEL_TERMS = {
    # Meta models
    "llama",
    "codellama",

    # Mistral models
    "mistral",
    "mixtral",
    "ministral",
    "codestral",

    # Google text models
    "gemma",
    "codegemma",
    "recurrentgemma",

    # OpenAI text models
    "gpt-",
    "gpt_",
    "chatgpt",
    "gpt-oss",

    # OpenAI reasoning models
    "o1",
    "o3",
    "o4",

    # Other known LLM families
    "qwen",
    "deepseek",
    "nemotron",
    "phi-",
    "phi_",
    "jamba",
    "granite",
    "command-r",
    "command_r",
    "dbrx",
    "falcon",
    "yi-large",
    "yi-",
    "chatglm",
    "glm-",
    "kimi",
    "allam",
    "sea-lion",
    "solar",
    "palmyra",
    "sarvam",
    "minimax",
    "step-",
    "seed-oss",
    "starcoder",
    "dracarys",
    "compound",
    "laguna",
    "inkling",
}


# ============================================================
# MODELS THAT SHOULD NOT BE USED FOR NORMAL TEXT CHAT
# ============================================================

# These terms override the known text-family list.
#
# For example:
#   llama-guard
#
# contains "llama", but it is a safety model rather than a normal
# assistant model. Because "guard" is below, it will be removed.
NON_TEXT_MODEL_TERMS = {
    # Speech and audio
    "audio",
    "whisper",
    "speech",
    "transcribe",
    "transcription",
    "tts",
    "text-to-speech",
    "text_to_speech",
    "speech-to-text",
    "speech_to_text",
    "orpheus",
    "playai",
    "riva",
    "realtime",

    # Image generation
    "image",
    "dall-e",
    "dalle",
    "diffusion",
    "stable-diffusion",
    "stable_diffusion",
    "flux",
    "sdxl",

    # Video
    "video",
    "sora",
    "cosmos",

    # Embeddings
    "embedding",
    "embeddings",
    "embed",
    "embedqa",
    "embedcode",
    "nv-embed",
    "bge-",
    "bge_",
    "e5-",
    "e5_",

    # Retrieval and reranking
    "retrieval",
    "retriever",
    "nemoretriever",
    "rerank",
    "reranker",

    # Safety, moderation and classification
    "guard",
    "safeguard",
    "safety",
    "moderation",
    "moderate",
    "classifier",
    "classification",
    "content-safety",
    "content_safety",
    "topic-control",
    "topic_control",
    "nemoguard",

    # Reward models are not normal assistant models
    "reward",

    # Vision and multimodal models
    "vision",
    "-vl",
    "_vl",
    "vlm",
    "vila",
    "neva",
    "fuyu",
    "kosmos",
    "deplot",
    "nvclip",

    # Computer vision tasks
    "object-detection",
    "object_detection",
    "segmentation",
    "detector",
    "grounding-dino",
    "grounding_dino",
    "dinov2",
    "streampetr",
    "sparsedrive",
    "visual-changenet",
    "visual_changenet",
    "ocr",

    # Parsing and information extraction
    "parse",
    "gliner",
    "pii",

    # Scientific or specialized non-chat models
    "ising",
    "calibration",
    "protein",
    "molecule",
    "weather",
    "climate",
    "route-optimization",
    "route_optimization",
}


# ============================================================
# PROVIDER-SPECIFIC TEXT MODEL RULES
# ============================================================

# OpenAI requires a stricter check because its model endpoint can
# return many non-chat and internal model IDs.
OPENAI_TEXT_PREFIXES = (
    "gpt-",
    "chatgpt-",
    "o1",
    "o3",
    "o4",
)


# These OpenAI model-name terms should still be rejected even if
# the ID begins with "gpt-".
OPENAI_EXCLUDED_TERMS = {
    "audio",
    "realtime",
    "transcribe",
    "tts",
    "image",
    "search",
    "embedding",
    "moderation",
}


# Models that should always be kept even if their names do not
# match the automatic rules.
MANUAL_INCLUDED_MODELS = {
    # GROQ
    "groq/groq/compound",
    "groq/groq/compound-mini",

    # Add another complete provider/model ID here when needed:
    # "nvidia/company/new-text-model",
}


# Models that should always be removed.
MANUAL_EXCLUDED_MODELS = {
    # GROQ speech and safety models
    "groq/canopylabs/orpheus-arabic-saudi",
    "groq/canopylabs/orpheus-v1-english",
    "groq/meta-llama/llama-prompt-guard-2-22m",
    "groq/meta-llama/llama-prompt-guard-2-86m",
    "groq/openai/gpt-oss-safeguard-20b",
    "groq/whisper-large-v3",
    "groq/whisper-large-v3-turbo",

    # Add any model that causes problems here:
    # "nvidia/company/model-id",
}


# ============================================================
# FILTER FUNCTIONS
# ============================================================

def contains_any(text, terms):
    """
    Return True if any term from the collection appears in text.
    """

    for term in terms:
        if term in text:
            return True

    return False


def is_openai_text_model(model_id):
    """
    OpenAI models must begin with a known text-model prefix.
    """

    if not model_id.startswith(OPENAI_TEXT_PREFIXES):
        return False

    if contains_any(
        model_id,
        OPENAI_EXCLUDED_TERMS
    ):
        return False

    return True


def is_known_text_generation_model(
    provider,
    model_id
):
    """
    Decide whether one model ID is probably intended for:

        text input -> text output

    This performs only local name checks.

    It does not send a prompt to the model.
    """

    if not isinstance(model_id, str):
        return False

    cleaned_id = model_id.strip().lower()

    if cleaned_id == "":
        return False

    complete_id = (
        provider.lower() +
        "/" +
        cleaned_id
    )

    # Manual inclusions have the highest priority.
    if complete_id in MANUAL_INCLUDED_MODELS:
        return True

    # Manual exclusions always remove the model.
    if complete_id in MANUAL_EXCLUDED_MODELS:
        return False

    # Remove obvious non-text or specialized models first.
    if contains_any(
        cleaned_id,
        NON_TEXT_MODEL_TERMS
    ):
        return False

    # OpenAI uses its own stricter rule.
    if provider.lower() == "openai":
        return is_openai_text_model(
            cleaned_id
        )

    # Groq and NVIDIA must contain a recognized LLM-family name.
    if contains_any(
        cleaned_id,
        KNOWN_TEXT_MODEL_TERMS
    ):
        return True

    return False


# ============================================================
# FETCH AND FILTER ONE PROVIDER
# ============================================================

def fetch_models(
    provider,
    url,
    api_key
):

    if not api_key:
        print(
            f"Failed loading {provider} models: "
            "API key is missing"
        )

        return []

    try:
        response = requests.get(
            url,
            headers={
                "Authorization":
                    f"Bearer {api_key}"
            },
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        models = []
        filtered_count = 0
        seen_model_ids = set()

        for model in data.get("data", []):

            model_id = model.get("id")

            # Skip records that do not have a model ID.
            if not model_id:
                continue

            # Skip duplicate model IDs.
            if model_id in seen_model_ids:
                continue

            seen_model_ids.add(model_id)

            # Only keep model IDs that look like known
            # text-generation models.
            if not is_known_text_generation_model(
                provider,
                model_id
            ):
                filtered_count += 1
                continue

            models.append({
                "provider": provider,
                "model_id": model_id,
                "display_name": model_id,
                "context_window": 0,
                "input_cost_per_million_tokens_cents": 0,
                "output_cost_per_million_tokens_cents": 0,
                "supports_streaming": True,
                "supports_tools": False,
                "input_type": "text",
                "output_type": "text",
                "filter_method": "known_model_name"
            })

        print(
            f"{provider.upper()}: "
            f"kept {len(models)} text models, "
            f"filtered out {filtered_count}"
        )

        return models

    except Exception as e:
        print(
            f"Failed loading {provider} models:",
            e
        )

        return []


# ============================================================
# FETCH ALL PROVIDERS AND SAVE THE LIST
# ============================================================

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


    # Sort models by provider and model ID.
    all_models.sort(
        key=lambda model: (
            model["provider"],
            model["model_id"].lower()
        )
    )


    os.makedirs(
        "data",
        exist_ok=True
    )


    with open(
        "data/models.json",
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            {
                "models": all_models
            },
            f,
            indent=2,
            ensure_ascii=False
        )


    print(
        f"Saved {len(all_models)} "
        "known text-generation models"
    )


if __name__ == "__main__":
    sync_models()