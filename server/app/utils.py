from .dependencies import datastore
from .classes import Speech


async def getPrompt(speech: Speech):
    context = await datastore.get_context()
    instructions = await datastore.get_instructions()
    conversations = await datastore.get_all_conversed(speech.target)
    heard_conversations = await datastore.get_all_heard(speech.target)
    npc = await datastore.get_behavior(speech.target)
    relation = await datastore.get_knowledge(speech.target)

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
