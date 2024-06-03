import json 
import os
import pathlib
from .classes import Speech 

# Load static files corresponding to the current game state
context = open(pathlib.Path("data/static/context.txt"), 'r').read()
instructions = open(pathlib.Path("data/instructions.txt"), 'r').read()


def getPrompt(speech: Speech):
    """
    This function generates a prompt for the AI model based on the given speech and game state.

    Parameters:
    speech (Speech): An object containing information about the speaker and their speech content.

    Returns:
    str: A formatted string representing the prompt for the AI model.

    The prompt includes the context, NPC information, heard conversations, relations, output, current conversations,
    the speaker's speech content, and instructions.
    """

    concat_id = speech.firstname+'_'+speech.lastname
    conversations = open("data/provisoire/conversations_"+concat_id  + '_' + speech.id+'.txt', 'r').read()
    heard_conversations = open("data/provisoire/heard_conversation_"+concat_id + '_' + speech.id+'.txt', 'r').read()
    npc = open(pathlib.Path("data/static/npc/npc_"+concat_id + '.txt'), 'r').read()
    relation = open(pathlib.Path("data/static/comportement/comportement_"+concat_id + '.txt'), 'r').read()

    return f"""{context} \n\n
        {npc} \n\n
        *CONVERSATION ENTENDUE
        {heard_conversations}  \n\n
        {relation}  \n\n
        *CONVERSATION
        {conversations} \n\n
        
        {speech.speaker} is speaking and says : "{speech.content}" \n\n
        
        {instructions}     
        """ 

