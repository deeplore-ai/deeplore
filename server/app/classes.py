from pydantic import BaseModel


class InstantiatedCharacter(BaseModel):
    firstname: str
    lastname: str
    session_id: str

    def fullname(self):
        return f"{self.firstname} {self.lastname}"
    
    def to_dict(self):
        return self.model_dump(mode="json")

class Speech(BaseModel):
    target: InstantiatedCharacter | None = None # Who is speaking
    speaker: InstantiatedCharacter | None = None # Who is speaking
    distance: str | None = None # How far is the speaker
    content: str | None = None # What the speaker is saying
    noAnswerExpected: bool = False # If the speaker need an answer or not

    def answer_speech(self, answer: str):
        answer_speech = Speech()
        answer_speech.speaker = self.target
        answer_speech.target = self.speaker   
        answer_speech.content = answer
        answer_speech.distance = self.distance
        answer_speech.noAnswerExpected = False
        return answer_speech
    
    def to_dict(self):
        return self.model_dump(mode="json")


class Conversation(BaseModel):
    speaker: InstantiatedCharacter
    content: str
    
    def to_prompt(self):
        return f"{self.speaker.fullname()} : {self.content}"

class HeardConversation(Conversation):
    distance: str
    
    def to_prompt(self):
        return f"{self.speaker.fullname()} : {self.distance} : {self.content}"

class PeopleList(BaseModel):
    """
    A class representing a list of people.
    """
    people: list[InstantiatedCharacter]
