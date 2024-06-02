import json 
import os
import pathlib
from .classes import Speech 

context = open(pathlib.Path("data/context.txt"), 'r').read()
output = open(pathlib.Path("data/context.txt"), 'r').read()
instructions = open(pathlib.Path("data/instructions"), 'r').read()


def getPrompt(speech: Speech):
    concat_id = speech.firstname+'_'+speech.lastname+'.txt'
    conversations = open(pathlib.Path("data/conversations_"+concat_id), 'r').read()
    heard_conversations = open(pathlib.Path("data/heard_conversation_"+concat_id), 'r').read()
    npc = open(pathlib.Path("data/npc_"+concat_id), 'r').read()
    relation = open(pathlib.Path("data/relations_"+concat_id), 'r').read()

    return f"""{context} \n\n
        {npc} \n\n
        {heard_conversations}  \n\n
        {relation}  \n\n
        {output}   \n\n
        {conversations} \n\n
        *Rules output:
        \t- If the person is not near to you, do not respond. 
        \t- Respond in french. 
        \t- Only the answers
        {instructions} \n\n

        {speech.speaker} is speaking and says : "{speech.content}" \n\n

        
        
        """ 

