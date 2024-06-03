import yaml

# Load env variables from .env.yaml file
MISTRAL_API_KEY = yaml.safe_load(open("/.env.yaml", "r"))["MISTRAL_API_KEY"]
GOOGLE_API_KEY = yaml.safe_load(open("/.env.yaml", "r"))["GOOGLE_API_KEY"]

# DEBUG flag
DEBUG=True