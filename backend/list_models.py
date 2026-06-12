import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url="https://integrate.api.nvidia.com/v1"
)

models = client.models.list()

for model in models.data:
    print(model.id)

#This file is to get valid models to call from main.py