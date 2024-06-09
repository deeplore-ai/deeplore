from pydantic import BaseModel

class Speech(BaseModel):
    """
    A class representing what a PNJ say.
    """
    id: str # id of the person who is playing the game
    firstname: str # First name of the PNJ
    lastname: str # Last name of the PNJ
    speaker: str | None = None # Who is speaking
    distance: str | None = None # How far is the speaker
    content: str | None = None # What the speaker is saying
    noAnswerExpected: bool = False # If the speaker need an answer or not
    

class People(BaseModel):
    """
    """
    firstname: str
    lastname: str


class PeopleList(BaseModel):
    """
    A class representing a list of people.
    """
    people: list[People]
        
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
        
