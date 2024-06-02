import json 
import os
import pathlib
from .classes import Speech 

context = open(pathlib.Path("data/context.txt"), 'r').read()
output = open(pathlib.Path("data/context.txt"), 'r').read()
instructions = open(pathlib.Path("data/instructions.txt"), 'r').read()


def getPrompt(speech: Speech):
    concat_id = speech.firstname+'_'+speech.lastname
    conversations = open("data/provisoire/conversations_"+concat_id  + speech.id+'.txt', 'r').read()
    heard_conversations = open("data/provisoire/heard_conversation_"+concat_id + speech.id+'.txt', 'r').read()
    npc = open(pathlib.Path("data/npc_"+concat_id + '.txt'), 'r').read()
    relation = open(pathlib.Path("data/relations_"+concat_id + '.txt'), 'r').read()

    return f"""{context} \n\n
        {npc} \n\n
        *CONVERSATION ENTENDUE
        {heard_conversations}  \n\n
        {relation}  \n\n
        {output}   \n\n
        *CONVERSATION
        {conversations} \n\n
        
        {speech.speaker} is speaking and says : "{speech.content}" \n\n
        
        {instructions} \n\n
        
        *Rules output:
        \t- If the person is far to you, do not respond. 
        \t- Respond in french. 
        \t- Print only the answer        
        """ 

