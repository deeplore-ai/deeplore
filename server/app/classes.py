from pydantic import BaseModel


class InstantiatedCharacter(BaseModel):
    """
    """
    firstname: str
    lastname: str
    session_id: str

    def fullname(self):
        return f"{self.firstname} {self.lastname}"

class Speech(BaseModel):
    """
    A class representing what a PNJ say.
    """
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
        
def test_speech():
    """
    This function is used to create a Speech object with predefined values for testing purposes.

    Parameters:
    None

    Returns:
    Speech: A Speech object with the following attributes:
        id: "Priest"
        firstname: "Matthieu"
        lastname: "Mancini"
        speaker: "Mancini"
        distance: "1m"
        content: "Bonjour, je suis un policier, je suis en train d'enquêter sur un meurtre dans la ville. Avez-vous vu ou entendu quelque chose d'étrange?"
        noAnswerExpected: False
    """
    return Speech(id="Priest", firstname="Matthieu", lastname="Mancini", speaker="Mancini", distance="1m", content="Bonjour, je suis un policier, je suis en train d'enquêter sur un meurtre dans la ville. Avez-vous vu ou entendu quelque chose d'étrange ?")
        
