from concurrent.futures import ThreadPoolExecutor
import asyncio
import os
import nest_asyncio

from .config import *

from .infrastructure.datastore.FirestoreDatastore import FirestoreDatastore
from .infrastructure.datastore.FileDatastore import FileDatastore
from .infrastructure.chat.Gemini import Gemini
from .infrastructure.chat.Mistral import Mistral
from .infrastructure.chat.LangChain import LangChain


nest_asyncio.apply()

##### Nombre de workers ###################
executor = ThreadPoolExecutor(max_workers=8)
loop = asyncio.get_event_loop()

if os.getenv("GOOGLE_PROJECT_NAME") is not None:
    datastore = FirestoreDatastore(project_id=os.getenv("GOOGLE_PROJECT_NAME"))
else:
    datastore = FileDatastore()

if os.getenv("USE_GEMINI") is not None and os.getenv("USE_GEMINI").lower() == "true":
    chat = Gemini()
elif os.getenv("USE_MISTRAL") is not None and os.getenv("USE_MISTRAL").lower() == "true":
    chat = Mistral()
else:
    chat = LangChain(datastore)