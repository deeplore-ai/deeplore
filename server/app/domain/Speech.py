from pydantic import BaseModel

from . import InstantiatedCharacter


class Speech(BaseModel):
    """
    A class used to represent a speech in a game.

    Attributes
    ----------
    target : InstantiatedCharacter | None
        The character who is being spoken to.
    speaker : InstantiatedCharacter | None
        The character who is speaking.
    distance : str | None
        The distance between the speaker and the target.
    content : str | None
        The content of the speech.
    noAnswerExpected : bool
        Indicates whether an answer is expected or not.
    """

    def answer_speech(self, answer: str) -> 'Speech':
        """
        Create a new Speech instance representing an answer to the current speech.

        Parameters
        ----------
        answer : str
            The content of the answer.

        Returns
        -------
        Speech
            A new Speech instance representing the answer.
        """
        answer_speech = Speech()
        answer_speech.speaker = self.target
        answer_speech.target = self.speaker   
        answer_speech.content = answer
        answer_speech.distance = self.distance
        answer_speech.noAnswerExpected = False
        return answer_speech
    
    def to_dict(self) -> dict:
        """
        Convert the Speech instance to a dictionary.

        Returns
        -------
        dict
            A dictionary representation of the Speech instance.
        """
        return self.model_dump(mode="json")