import os
import yaml

try:
    # Load environment variables from .env.yaml file
    envFile = yaml.safe_load(open(".env.yaml", "r"))
except:
    # If .env.yaml file does not exist, initialize an empty dictionary
    envFile = {}

# Set environment variables from .env.yaml file
for key, value in envFile.items():
    os.environ[key] = value

# Retrieve Mistral API key from environment variables, default to empty string if not set
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY", "")

# Retrieve Google API key from environment variables, default to empty string if not set
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

# Retrieve OpenAI API key from environment variables, default to empty string if not set
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Retrieve Google project name from environment variables, default to empty string if not set
GOOGLE_PROJECT_NAME = os.environ.get("GOOGLE_PROJECT_NAME", "")

# Retrieve DEBUG flag from environment variables, default to False if not set
DEBUG = eval(os.environ.get("DEBUG", "False"))

# Retrieve model name from environment variables, default to empty string if not set
MODEL_NAME = os.environ.get("MODEL_NAME", "")

# Retrieve LOCAL flag from environment variables, default to False if not set
# Boolean to indicate if the model is local or not
LOCAL = eval(os.environ.get("LOCAL", "False"))

# Retrieve USE_GEMINI flag from environment variables, default to False if not set
USE_GEMINI = eval(os.environ.get("USE_GEMINI", "False"))

# Retrieve USE_LANGCHAIN flag from environment variables, default to False if not set
USE_LANGCHAIN = eval(os.environ.get("USE_LANGCHAIN", "False"))

# Retrieve USE_MISTRAL flag from environment variables, default to False if not set
USE_MISTRAL = eval(os.environ.get("USE_MISTRAL", "False"))

# Retrieve Google application credentials path from environment variables, default to empty string if not set
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")

