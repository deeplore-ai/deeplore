from . import InstantiatedCharacter, PeopleList, Speech


class BaseDatastore:
    def get_vectorizable_content(self):
        pass

    def start_session(self, people_list: PeopleList):
        pass

    def hear(self, speech: Speech):
        pass

    def answer(self, answer: Speech):
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