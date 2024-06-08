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
SERVEUR_ADRESSE = "http://localhost:8000" # Serveur adresse where the chatbot server is hosted
LOCAL = True # Boolean to indicate if the model is local or not
MODEL_NAME = "llama3-chatqa:70b" # Model name used for the chatbot
