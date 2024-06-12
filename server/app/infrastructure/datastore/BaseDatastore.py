from app.classes import InstantiatedCharacter, PeopleList, Speech


class BaseDatastore:
    def get_vectorizable_content(self):
        pass

    def start_session(self, session_id: str, people_list: PeopleList):
        pass

    def hear(self, speech: Speech):
        pass

    def converse(self, speech: Speech):
        pass

    def get_all_conversed(self, npc: InstantiatedCharacter):
        pass

    def get_all_heard(self, npc: InstantiatedCharacter):
        pass
    
    def get_behavior(self, npc: InstantiatedCharacter):
        pass

    def get_knowledge(self, npc: InstantiatedCharacter):
        pass

    def get_context(self):
        pass

    def get_instructions(self):
        pass