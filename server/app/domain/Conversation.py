from pydantic import BaseModel

from . import InstantiatedCharacter


class Conversation(BaseModel):
    """
    A class representing a conversation between a speaker and content.

    Attributes
    ----------
    speaker : InstantiatedCharacter
        The character who is speaking.
    content : str
        The content of the conversation.

    Methods
    -------
    to_prompt()
        Returns a formatted string representing the conversation in a prompt format.
    """

    speaker: InstantiatedCharacter
    content: str

    def to_prompt(self):
        """
        Returns a formatted string representing the conversation in a prompt format.

        Returns
        -------
        str
            A string in the format "Speaker's Fullname : Content".
        """
        return f"{self.speaker.fullname()} : {self.content}"


class HeardConversation(Conversation):
    """
    A class representing a conversation heard by another character.

    Attributes
    ----------
    speaker : InstantiatedCharacter
        The character who is speaking.
    content : str
        The content of the conversation.
    distance : str
        The distance from the speaker to the listener.

    Methods
    -------
    to_prompt()
        Returns a formatted string representing the conversation in a prompt format.
    """

    distance: str

    def to_prompt(self):
        """
        Returns a formatted string representing the conversation in a prompt format.

        Returns
        -------
        str
            A string in the format "Speaker's Fullname : Distance : Content".
        """
        return f"{self.speaker.fullname()} : {self.distance} : {self.content}"