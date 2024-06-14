from .dependencies import datastore
from .domain import Speech


def getPrompt(speech: Speech):
    context = datastore.get_context()
    instructions = datastore.get_instructions()
    conversations = datastore.get_all_conversed(speech.target)
    heard_conversations = datastore.get_all_heard(speech.target)
    npc = datastore.get_behavior(speech.target)
    relation = datastore.get_knowledge(speech.target)

    return f"""{context} \n\n
        {npc} \n\n
        *CONVERSATION ENTENDUE
        {'\n'.join([heard_conversation.to_prompt() for heard_conversation in heard_conversations])}  \n\n
        {relation}  \n\n
        *CONVERSATION
        {'\n'.join([conversation.to_prompt() for conversation in conversations])} \n\n
        
        {speech.speaker} is speaking and says : "{speech.content}" \n\n
        
        {instructions}     
        """
