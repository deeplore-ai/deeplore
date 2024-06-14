import time
from ...domain import Conversation, InstantiatedCharacter, Speech, BaseDatastore
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter, Or

class FirestoreDatastore(BaseDatastore):
    def __init__(self, project_id: str):
        self.db = firestore.Client(project=project_id)

    def get_instructions(self):
        instructions_refs = self.db.collection("instructions")
        instructions = instructions_refs.stream()
        return next(instructions).to_dict()["content"]
    
    def get_context(self):
        context_refs = self.db.collection("context")
        context = context_refs.stream()
        return next(context).to_dict()["content"]
    
    def hear(self, speech: Speech):
        self.add_speech(speech)
    
    def converse(self, speech: Speech, answer: Speech):
        self.add_speech(speech)
        self.add_speech(answer)

    def get_all_conversed(self, npc: InstantiatedCharacter):
        speech_refs = self.db.collection("speeches")
        speeches = speech_refs.where(
            filter=FieldFilter("session_id", "==", npc.session_id)
        ).where(
            filter=FieldFilter("answer_expected", "==", True)
        ).where(
            filter=Or(filters=[
                FieldFilter("speaker", "==", npc.to_dict()),
                FieldFilter("target", "==", npc.to_dict())
            ])
        ).order_by("timestamp", direction=firestore.Query.ASCENDING).stream()
        conversations = []
        for speechDoc in speeches:
            speech = speechDoc.to_dict()
            speaker = InstantiatedCharacter(**speech["speaker"])
            conversation = Conversation(speaker=speaker, content=speech["content"])
            conversations.append(conversation)
        return conversations
    
    def get_all_heard(self, npc: InstantiatedCharacter):
        speech_refs = self.db.collection("speeches")
        speeches = speech_refs.where(
            filter=FieldFilter("session_id", "==", npc.session_id)
        ).where(
            filter=FieldFilter("answer_expected", "==", False)
        ).where(
            filter=FieldFilter("target", "==", npc.to_dict())
        ).order_by("timestamp", direction=firestore.Query.ASCENDING).stream()
        conversations = []
        for speechDoc in speeches:
            speech = speechDoc.to_dict()
            speaker = InstantiatedCharacter(**speech["speaker"])
            conversation = Conversation(speaker=speaker, content=speech["content"], distance=speech["distance"])
            conversations.append(conversation)
        return conversations
    
    def get_behavior(self, npc: InstantiatedCharacter):
        character_refs = self.db.collection("character")
        character = character_refs.where(
            filter=FieldFilter("firstname", "==", npc.firstname)
        ).where(
            filter=FieldFilter("lastname", "==", npc.lastname)
        ).get()[0].to_dict()
        behavior = ""
        for behaviorPart in character["behavior"]:
            behavior += "## " + behaviorPart["name"] + "\n" + behaviorPart["content"] + "\n"
        return behavior

    def get_knowledge(self, npc: InstantiatedCharacter):
        character_refs = self.db.collection("character")
        character = character_refs.where(
            filter=FieldFilter("firstname", "==", npc.firstname)
        ).where(
            filter=FieldFilter("lastname", "==", npc.lastname)
        ).get()[0].to_dict()
        knowledge = ""
        for knowledgePart in character["knowledges"]:
            knowledge += "## " + knowledgePart["name"] + "\n" + knowledgePart["content"] + "\n"
        return knowledge
    
    def add_speech(self, speech: Speech):
        speech_refs = self.db.collection("speeches")
        speech_refs.add({
            "session_id": speech.target.session_id,
            "content": speech.content,
            "speaker": speech.speaker.to_dict(),
            "target": speech.target.to_dict(),
            "distance": speech.distance,
            "answer_expected": not speech.noAnswerExpected,
            "timestamp": round(time.time() * 1000)
        })