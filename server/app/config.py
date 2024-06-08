import os
import yaml

# Load env variables from .env.yaml file
MISTRAL_API_KEY = yaml.safe_load(open(".env.yaml", "r"))["MISTRAL_API_KEY"]
GOOGLE_API_KEY = yaml.safe_load(open(".env.yaml", "r"))["GOOGLE_API_KEY"]
OPENAI_API_KEY = yaml.safe_load(open(".env.yaml", "r"))["OPENAI_API_KEY"]

os.environ["MISTRAL_API_KEY"] = MISTRAL_API_KEY
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# DEBUG flag
DEBUG = True

# Serveur adresse
SERVEUR_ADRESSE = yaml.safe_load(open(".env.yaml", "r"))["SERVEUR_ADRESSE"] # Serveur adresse where the chatbot server is hosted
LOCAL = yaml.safe_load(open(".env.yaml", "r"))["LOCAL"] # Boolean to indicate if the model is local or not
MODEL_NAME = yaml.safe_load(open(".env.yaml", "r"))["MODEL_NAME"] # Model name used for the chatbot
USE_GEMINI = yaml.safe_load(open(".env.yaml", "r"))["USE_GEMINI"] # Gemini is used (API Key required)
USE_LANGCHAIN = yaml.safe_load(open(".env.yaml", "r"))["USE_LANGCHAIN"] # Langchain is used (API Key required)
USE_MISTRAL = yaml.safe_load(open(".env.yaml", "r"))["USE_MISTRAL"] # Mistral is used (API Key required)
