"""
This module initializes the necessary components for the application.

Attributes:
- executor: A ThreadPoolExecutor for managing concurrent tasks.
- loop: The asyncio event loop.
- datastore: The chosen datastore implementation (FirestoreDatastore or FileDatastore).
- chat: The chosen chat implementation (Gemini, Mistral, or LangChain).
"""

import os
import nest_asyncio
from concurrent.futures import ThreadPoolExecutor
import asyncio

from .config import *
from .infrastructure.datastore.FirestoreDatastore import FirestoreDatastore
from .infrastructure.datastore.FileDatastore import FileDatastore
from .infrastructure.chat.Gemini import Gemini
from .infrastructure.chat.Mistral import Mistral
from .infrastructure.chat.LangChain import LangChain

# Apply nest_asyncio to allow nested asyncio event loops
nest_asyncio.apply()

# Define the ThreadPoolExecutor with a maximum of 8 workers
executor = ThreadPoolExecutor(max_workers=8)

# Get the asyncio event loop
loop = asyncio.get_event_loop()

# Initialize the datastore based on the environment variable GOOGLE_PROJECT_NAME
if os.getenv("GOOGLE_PROJECT_NAME") is not None:
    datastore = FirestoreDatastore(project_id=os.getenv("GOOGLE_PROJECT_NAME"))
else:
    datastore = FileDatastore()

# Initialize the chat implementation based on the environment variables USE_GEMINI and USE_MISTRAL
if os.getenv("USE_GEMINI") is not None and os.getenv("USE_GEMINI").lower() == "true":
    chat = Gemini()
elif os.getenv("USE_MISTRAL") is not None and os.getenv("USE_MISTRAL").lower() == "true":
    chat = Mistral()
else:
    chat = LangChain(datastore)