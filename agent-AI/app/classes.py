from pydantic import BaseModel

class Speech(BaseModel):
    npc: str
    speaker: str | None = None
    content: str | None = None
    
    
class People(BaseModel):
    firstname: str
    lastname: str
    role : str
    
        
        
        