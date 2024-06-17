from pydantic import BaseModel


class InstantiatedCharacter(BaseModel):
    firstname: str
    lastname: str
    session_id: str
    action: str | None = None
    distance: str | None = None

    def fullname(self):
        return f"{self.firstname} {self.lastname}"
    
    def to_dict(self):
        return self.model_dump(mode="json")


class PeopleList(BaseModel):
    """
    A class representing a list of people.
    """
    people: list[InstantiatedCharacter]