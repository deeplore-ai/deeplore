from pydantic import BaseModel

class Speech(BaseModel):
    id: str
    firstname: str
    lastname: str
    speaker: str | None = None
    distance: str | None = None
    content: str | None = None
    
    
class People(BaseModel):
    firstname: str
    lastname: str
    role : str
    
        
def test_speech():
    return Speech(id="Priest", firstname="Matthieu", lastname="Mancini", speaker="Mancini", distance="1m", content="Bonjour, je suis un policier, je suis en train d'enquêter sur un meurtre dans la ville. Avez-vous vu ou entendu quelque chose d'étrange ?")
        
