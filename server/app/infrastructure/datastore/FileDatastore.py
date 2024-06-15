from pathlib import Path

from ...domain import Conversation, HeardConversation, InstantiatedCharacter, PeopleList, Speech, BaseDatastore

encoding = "utf-8"

class FileDatastore(BaseDatastore):
    def get_vectorizable_content(self):
        """
        This method reads the content of context.txt and instructions.txt files,
        and returns their combined content.

        Parameters:
        None

        Returns:
        str: The combined content of context.txt and instructions.txt files.

        Raises:
        FileNotFoundError: If either context.txt or instructions.txt files are not found.
        """
        vectorizable_content = ""
        with open("data/static/context.txt", 'r', encoding=encoding) as f:
            vectorizable_content += f.read()
        with open("data/static/instructions.txt", 'r', encoding=encoding) as f:
            vectorizable_content += f.read()
        return vectorizable_content
    
    def start_session(self, people_list: PeopleList):
        """
        This method initializes a new session by creating conversation and heard conversation files for each NPC in the given PeopleList.

        Parameters:
        people_list (PeopleList): A list of NPCs for which the session needs to be initialized.

        Returns:
        None

        Raises:
        None
        """
        Path("data/provisoire").mkdir(parents=True, exist_ok=True)  # Create the directory if it doesn't exist
        for person in people_list.people:
            # Open conversation and heard conversation files for each NPC in append mode
            open("data/provisoire/conversations_"+self._get_npc_id(person)+'.txt', 'a', encoding=encoding).close()
            open("data/provisoire/heard_conversation_"+self._get_npc_id(person)+'.txt', 'a', encoding=encoding).close()

    def hear(self, speech: Speech):
        """
        This method logs the speech heard by the NPC in a file.

        Parameters:
        speech (Speech): The speech object containing the speaker, distance, and content.

        Returns:
        None

        Raises:
        None

        The method opens the file corresponding to the NPC's ID in append mode.
        It writes the speaker's fullname, distance (if provided), and content of the speech into the file.
        Each entry is separated by a semicolon and a newline character.
        """
        with open("data/provisoire/heard_conversation_" + self._get_npc_id(speech.target) + ".txt", 'a', encoding=encoding) as f:
            f.write("\n"+speech.speaker.fullname() + " ; " +
                    (speech.distance if speech.distance else '0') + ' ; ' + speech.content)

    def converse(self, speech: Speech, answer: Speech):
        """
        Logs the conversation between two characters in a file.

        Parameters:
        speech (Speech): The speech object containing the speaker, content, and target.
        answer (Speech): The speech object containing the speaker, content, and target.

        Returns:
        None

        The method opens the file corresponding to the NPC's ID in append mode.
        It writes the speaker's fullname and content of the speech into the file.
        Each entry is separated by a colon and a newline character.
        The method also writes the answer's speaker's fullname and content into the file.
        """
        with open("data/provisoire/conversations_" + self._get_npc_id(speech.target) + ".txt", 'a', encoding=encoding) as f:
            f.write("\n"+speech.speaker.fullname() + ' : ' + speech.content)
            f.write("\n"+answer.speaker.fullname() + ' : ' + answer.content)

    def get_all_conversed(self, npc: InstantiatedCharacter):
        """
        Retrieves all conversations logged for a specific NPC.

        Parameters:
        npc (InstantiatedCharacter): The NPC for which the conversations need to be retrieved.

        Returns:
        List[Conversation]: A list of Conversation objects representing the conversations logged for the NPC.

        The method reads the conversation file corresponding to the NPC's ID,
        parses each line to extract the speaker's fullname and content of the conversation,
        and creates a Conversation object for each line.
        The Conversation objects are then added to a list and returned.
        """
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

    def get_all_heard(self, npc: InstantiatedCharacter):
        """
        Retrieves all conversations heard by a specific NPC.

        Parameters:
        npc (InstantiatedCharacter): The NPC for which the conversations need to be retrieved.

        Returns:
        List[HeardConversation]: A list of HeardConversation objects representing the conversations heard by the NPC.

        The method reads the heard conversation file corresponding to the NPC's ID,
        parses each line to extract the speaker's fullname, distance, and content of the conversation,
        and creates a HeardConversation object for each line.
        The HeardConversation objects are then added to a list and returned.
        """
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
    
    def get_behavior(self, npc: InstantiatedCharacter):
        return open("data/static/npc/npc_" + self._get_npc_identity(npc) + '.txt', 'r', encoding=encoding).read()

    def get_knowledge(self, npc: InstantiatedCharacter):
        return open("data/static/comportement/comportement_" + self._get_npc_identity(npc) + '.txt', 'r', encoding=encoding).read()

    def get_context(self):
        return open("data/static/context.txt", 'r', encoding=encoding).read()

    def get_instructions(self):
        return open("data/static/instructions.txt", 'r', encoding=encoding).read()

    def _get_npc_id(self, npc: InstantiatedCharacter):
        return f"{self._get_npc_identity(npc)}_{npc.session_id}"
    
    def _get_npc_identity(self, npc: InstantiatedCharacter):
        return f"{npc.firstname}_{npc.lastname}"