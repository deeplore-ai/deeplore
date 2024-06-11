import os
import yaml

envFile = yaml.safe_load(open(".env.yaml", "r"))

# Load env variables from .env.yaml file
MISTRAL_API_KEY = envFile["MISTRAL_API_KEY"]
GOOGLE_API_KEY = envFile["GOOGLE_API_KEY"]
OPENAI_API_KEY = envFile["OPENAI_API_KEY"]

GOOGLE_PROJECT_NAME = envFile["GOOGLE_PROJECT_NAME"]

os.environ["MISTRAL_API_KEY"] = MISTRAL_API_KEY
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
# DEBUG flag
DEBUG = True

# Serveur adresse
SERVEUR_ADRESSE = envFile["SERVEUR_ADRESSE"] # Serveur adresse where the chatbot server is hosted
LOCAL = envFile["LOCAL"] # Boolean to indicate if the model is local or not
MODEL_NAME = envFile["MODEL_NAME"] # Model name used for the chatbot
USE_GEMINI = envFile["USE_GEMINI"] # Gemini is used (API Key required)
USE_LANGCHAIN = envFile["USE_LANGCHAIN"] # Langchain is used (API Key required)
USE_MISTRAL = envFile["USE_MISTRAL"] # Mistral is used (API Key required)

if "GOOGLE_APPLICATION_CREDENTIALS" in envFile:
    GOOGLE_APPLICATION_CREDENTIALS = envFile["GOOGLE_APPLICATION_CREDENTIALS"]
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS


