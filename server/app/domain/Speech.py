from pydantic import BaseModel

from . import InstantiatedCharacter


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