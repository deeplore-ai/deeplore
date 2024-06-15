import time
from ...domain import Conversation, InstantiatedCharacter, Speech
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter, Or
from .FileDatastore import FileDatastore

class FirestoreDatastore(FileDatastore):
    def __init__(self, project_id: str):
        """
        Initialize FirestoreDatastore instance.

        This method creates a Firestore client using the provided project ID.
        The client is used to interact with Firestore database.

        Parameters:
        project_id (str): The ID of the Google Cloud project.

        Returns:
        None
        """
        self.db = firestore.Client(project=project_id)

    def get_instructions(self):
        """
        Retrieve the instructions from Firestore collection 'instructions'.

        This method retrieves the first document from the 'instructions' collection
        and returns its 'content' field.

        Parameters:
        None

        Returns:
        str: The content of the first instruction document in the 'instructions' collection.
        """
        instructions_refs = self.db.collection("instructions")
        instructions = instructions_refs.stream()
        return next(instructions).to_dict()["content"]
    
    def get_context(self):
        """
        Retrieve the context from Firestore collection 'context'.

        This method retrieves the first document from the 'context' collection
        and returns its 'content' field.

        Parameters:
        None

        Returns:
        str: The content of the first context document in the 'context' collection.
        """
        context_refs = self.db.collection("context")
        context = context_refs.stream()
        return next(context).to_dict()["content"]
    
    def hear(self, speech: Speech):
        """
        This method is responsible for recording a speech in the Firestore database.
        It calls the add_speech method to store the speech data.

        Parameters:
        speech (Speech): An instance of Speech class containing the speaker, target, content, distance, and noAnswerExpected attributes.

        Returns:
        None
        """
        self.add_speech(speech)
    
    def converse(self, speech: Speech, answer: Speech):
        """
        This method is responsible for recording two speeches in the Firestore database.
        It calls the add_speech method twice to store the speech and answer data.

        Parameters:
        speech (Speech): An instance of Speech class containing the speaker, target, content, distance, and noAnswerExpected attributes for the speech.
        answer (Speech): An instance of Speech class containing the speaker, target, content, distance, and noAnswerExpected attributes for the answer.

        Returns:
        None
        """
        self.add_speech(speech)
        self.add_speech(answer)

    def get_all_conversed(self, npc: InstantiatedCharacter):
        """
        Retrieve all conversations between the NPC and other characters in the Firestore database.

        This method retrieves all speech documents from the 'speeches' collection where:
        - The 'session_id' matches the NPC's session ID.
        - The 'answer_expected' is True, indicating that the speech is part of a conversation.
        - The 'speaker' or 'target' matches the NPC's character data.

        The retrieved speech documents are sorted in ascending order based on the 'timestamp' field.
        For each speech document, the method creates an instance of Conversation using the speaker's character data and the speech content.
        The Conversation instances are then added to a list and returned.

        Parameters:
        npc (InstantiatedCharacter): The NPC character for which to retrieve conversations.

        Returns:
        List[Conversation]: A list of Conversation instances representing the conversations between the NPC and other characters.
        """
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
        """
        Retrieve all speeches heard by the NPC in the Firestore database.

        This method retrieves all speech documents from the 'speeches' collection where:
        - The 'session_id' matches the NPC's session ID.
        - The 'answer_expected' is False, indicating that the speech is not part of a conversation.
        - The 'target' matches the NPC's character data.

        The retrieved speech documents are sorted in ascending order based on the 'timestamp' field.
        For each speech document, the method creates an instance of Conversation using the speaker's character data,
        the speech content, and the distance. The Conversation instances are then added to a list and returned.

        Parameters:
        npc (InstantiatedCharacter): The NPC character for which to retrieve the heard speeches.

        Returns:
        List[Conversation]: A list of Conversation instances representing the speeches heard by the NPC.
        """
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
        """
        Retrieve the behavior of a specific NPC from Firestore database.

        This method retrieves the behavior data of a specific NPC from the 'character' collection in Firestore.
        The NPC is identified by its firstname and lastname. The retrieved behavior data is then formatted
        into a string with markdown headers for each behavior part.

        Parameters:
        npc (InstantiatedCharacter): The NPC character for which to retrieve the behavior.

        Returns:
        str: A string containing the formatted behavior data of the NPC. The string is formatted with markdown headers for each behavior part.
        """
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
        """
        Retrieve the knowledge of a specific NPC from Firestore database.

        This method retrieves the knowledge data of a specific NPC from the 'character' collection in Firestore.
        The NPC is identified by its firstname and lastname. The retrieved knowledge data is then formatted
        into a string with markdown headers for each knowledge part.

        Parameters:
        npc (InstantiatedCharacter): The NPC character for which to retrieve the knowledge.

        Returns:
        str: A string containing the formatted knowledge data of the NPC. The string is formatted with markdown headers for each knowledge part.
        """
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
        """
        This method adds a speech to the Firestore database.

        Parameters:
        speech (Speech): An instance of Speech class containing the speaker, target, content, distance, and noAnswerExpected attributes.

        Returns:
        None

        The method creates a new document in the 'speeches' collection with the following fields:
        - session_id: The session ID of the NPC.
        - content: The content of the speech.
        - speaker: A dictionary representing the speaker's character data.
        - target: A dictionary representing the target's character data.
        - distance: The distance between the speaker and target.
        - answer_expected: A boolean indicating whether an answer is expected for this speech.
        - timestamp: The current timestamp in milliseconds.
        """
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