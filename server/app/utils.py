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
        
        {speech.speaker} is speaking and says : "{speech.content}"\n\n

        {instructions}
        
        Question : {speech.content}
        """

def getPromptWHATIDO(npc, current_action, npc_aroud, heard=None):
    npc_aroud_string = ""
    for n in npc_aroud:
        npc_aroud_string += f"{n.firstname} {n.lastname}, "
    heard_string = ""
    if heard is not None:
        heard_string = f"Tu as entendu {heard.firstname} {heard.lastname} dire : {heard.content}"
    precision = """
        Tu es {firstname} {lastName} et tu dois choisir ta prochaine action.

        Maintenant, ton action est : {current_action}.

        Autour de toi, tu as : {npc_aroud_string} 
        {heard_string}
        
        Tu as le choix entre 4 actions que tu peux réaliser : 
            - Speak : La prochaine action est de parler.
            - Move : La prochaine action est de vous déplacer à quelqu'un. 
            - Stop : La prochaine action est de s'arrêter.
            - ContinueAction : Tu continues l'action que tu as actuellement.
        
        
        *INSTRUCTIONS:
        Rules:
            - Your role is to choose your next action
            - Choose between Speak, Move and ContinueAction.
            - If you choose Speak or Move, you have to point someone.
            - Hearing someone talk doesn't necessarily merit a response.
            - Hearing someone talk doesn't necessarily merit to move to her.
            - If you are stop, you need to choose between Speak, Move and ContinueAction.
        Output response format:
            - Only one of the 4 actions can be chosen.
            - If you choose Speak, you have to point someone. return: Move, name
            - If you choose Move, you have to point someone. return: Speak, name
            - If you choose Stop. return: Stop, None
            - If you choose ContinueAction. return: ContinueAction, None
    """
    return precision.format(firstname=npc.firstname, lastName=npc.lastname, current_action=current_action, 
                            npc_aroud_string=npc_aroud_string, heard_string=heard_string)
