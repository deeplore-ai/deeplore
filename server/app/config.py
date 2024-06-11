import os
import yaml

try:
    envFile = yaml.safe_load(open(".env.yaml", "r"))
except:
    envFile = {}

for key, value in envFile.items():
    os.environ[key] = value

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GOOGLE_PROJECT_NAME = os.environ.get("GOOGLE_PROJECT_NAME", "")
DEBUG = eval(os.environ.get("DEBUG", "False"))
MODEL_NAME = os.environ.get("MODEL_NAME", "")
LOCAL = eval(os.environ.get("LOCAL", "False")) # Boolean to indicate if the model is local or not
USE_GEMINI = eval(os.environ.get("USE_GEMINI", "False"))
USE_LANGCHAIN = eval(os.environ.get("USE_LANGCHAIN", "False"))
USE_MISTRAL = eval(os.environ.get("USE_MISTRAL", "False"))
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")

