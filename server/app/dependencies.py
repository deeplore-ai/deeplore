from concurrent.futures import ThreadPoolExecutor
import asyncio
import os
import nest_asyncio

from .infrastructure.datastore.FirestoreDatastore import FirestoreDatastore
from .infrastructure.datastore.FileDatastore import FileDatastore
nest_asyncio.apply()

##### Nombre de workers ###################
executor = ThreadPoolExecutor(max_workers=8)
loop = asyncio.get_event_loop()

if os.getenv("GOOGLE_PROJECT_NAME") is not None:
    datastore = FirestoreDatastore(project_id=os.environ["GOOGLE_PROJECT_NAME"])
else:
    datastore = FileDatastore()
