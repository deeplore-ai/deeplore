from concurrent.futures import ThreadPoolExecutor
import asyncio
import nest_asyncio

from .infrastructure.datastore.FileDatastore import FileDatastore
nest_asyncio.apply()

##### Nombre de workers ###################
executor = ThreadPoolExecutor(max_workers=8)
loop = asyncio.get_event_loop()

datastore = FileDatastore()