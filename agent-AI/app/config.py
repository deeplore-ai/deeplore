import yaml

MISTRAL_API_KEY = yaml.safe_load(open("/.env.yaml", "r"))["MISTRAL_API_KEY"]
DEBUG=True