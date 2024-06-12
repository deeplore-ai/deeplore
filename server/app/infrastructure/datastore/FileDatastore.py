from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader

from .BaseDatastore import BaseDatastore
from ...classes import Conversation, HeardConversation, InstantiatedCharacter, PeopleList, Speech

encoding = "utf-8"

class FileDatastore(BaseDatastore):
    async def get_vectorizable_content(self):
        loader = DirectoryLoader('data', glob="**/static/*.txt")
        return loader.load()
    
    async def start_session(self, people_list: PeopleList):
        Path("data/provisoire").mkdir(parents=True, exist_ok=True)
        for person in people_list.people:
            open("data/provisoire/conversations_"+self._get_npc_id(person)+'.txt', 'a', encoding=encoding).close()
            open("data/provisoire/heard_conversation_"+self._get_npc_id(person)+'.txt', 'a', encoding=encoding).close()

    async def hear(self, speech: Speech):
        with open("data/provisoire/heard_conversation_" + self._get_npc_id(speech.target) + ".txt", 'a', encoding=encoding) as f:
            f.write("\n"+speech.speaker.fullname() + " ; " +
                    (speech.distance if speech.distance else '0') + ' ; ' + speech.content)

    async def converse(self, speech: Speech, answer: Speech):
        with open("data/provisoire/conversations_" + self._get_npc_id(speech.target) + ".txt", 'a', encoding=encoding) as f:
            f.write("\n"+speech.speaker.fullname() + ' : ' + speech.content)
            f.write("\n"+answer.speaker.fullname() + ' : ' + answer.content)

    async def get_all_conversed(self, npc: InstantiatedCharacter):
        conversations_file = open("data/provisoire/conversations_" + self._get_npc_id(npc) + ".txt", 'r', encoding=encoding).read()
        conversations = []
        for line in conversations_file.splitlines():
            if line == "":
                continue
            splitted_line = line.split(" : ", 1)
            fullname = splitted_line[0].split(" ")
            conversation = Conversation(speaker=InstantiatedCharacter(firstname=fullname[0], lastname=fullname[1], session_id=npc.session_id), content=splitted_line[1])
            conversations.append(conversation)
        return conversations

    async def get_all_heard(self, npc: InstantiatedCharacter):
        heard_conversations_file = open("data/provisoire/heard_conversation_" + self._get_npc_id(npc) + ".txt", 'r', encoding=encoding).read()
        heard_conversations = []
        for line in heard_conversations_file.splitlines():
            if line == "":
                continue
            splitted_line = line.split(" ; ")
            fullname = splitted_line[0].split(" ")
            conversation = HeardConversation(
                speaker=InstantiatedCharacter(firstname=fullname[0], lastname=fullname[1], session_id=npc.session_id),
                distance=splitted_line[1],
                content=splitted_line[2]
            )
            heard_conversations.append(conversation)
        return heard_conversations
    
    async def get_behavior(self, npc: InstantiatedCharacter):
        return open("data/static/npc/npc_" + self._get_npc_identity(npc) + '.txt', 'r', encoding=encoding).read()

    async def get_knowledge(self, npc: InstantiatedCharacter):
        return open("data/static/comportement/comportement_" + self._get_npc_identity(npc) + '.txt', 'r', encoding=encoding).read()

    async def get_context(self):
        return open("data/static/context.txt", 'r', encoding=encoding).read()

    async def get_instructions(self):
        return open("data/static/instructions.txt", 'r', encoding=encoding).read()

    def _get_npc_id(self, npc: InstantiatedCharacter):
        return f"{self._get_npc_identity(npc)}_{npc.session_id}"
    
    def _get_npc_identity(self, npc: InstantiatedCharacter):
        return f"{npc.firstname}_{npc.lastname}"