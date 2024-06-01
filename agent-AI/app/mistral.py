from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import yaml

api_key = yaml.safe_load(open("/.env.yaml", "r"))["MISTRAL_API_KEY"]
model = "mistral-large-latest"
