from pydantic import BaseModel


class InstantiatedCharacter(BaseModel):
    """
    A class representing an instantiated character.

    Attributes:
    firstname (str): The first name of the character.
    lastname (str): The last name of the character.
    session_id (str): The session ID associated with the character.

    Methods:
    fullname(): Returns the full name of the character.
    to_dict(): Returns a dictionary representation of the character.
    """
    firstname: str
    lastname: str
    session_id: str

    def fullname(self):
        """
        Returns the full name of the character.

        Returns:
        str: The full name of the character.
        """
        return f"{self.firstname} {self.lastname}"
    
    def to_dict(self):
        """
        Returns a dictionary representation of the character.

        Returns:
        dict: A dictionary representation of the character.
        """
        return self.model_dump(mode="json")


class PeopleList(BaseModel):
    """
    A class representing a list of people.

    Attributes:
    people (list[InstantiatedCharacter]): A list of instantiated characters.
    """
    people: list[InstantiatedCharacter]