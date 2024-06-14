from pydantic import BaseModel

from . import InstantiatedCharacter


class Conversation(BaseModel):
    speaker: InstantiatedCharacter
    content: str
    
    def to_prompt(self):
        return f"{self.speaker.fullname()} : {self.content}"


class HeardConversation(Conversation):
    distance: str
    
    def to_prompt(self):
        return f"{self.speaker.fullname()} : {self.distance} : {self.content}"