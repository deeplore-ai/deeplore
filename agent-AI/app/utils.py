import json 
import os
import pathlib
from .classes import Speech 

context = open(pathlib.Path("data/context.txt"), 'r').read()
output = open(pathlib.Path("data/context.txt"), 'r').read()


def getPrompt(speech: Speech):
    concat_id = speech.firstname+'_'+speech.lastname+'.txt'
    conversations = open("data/conversations_"+concat_id, 'r').read()
    heard_conversations = open("data/heard_conversations_"+concat_id, 'r').read()
    npc = open("data/npc_"+concat_id, 'r').read()
    relation = open("data/relation_"+concat_id, 'r').read()

    return f"""{context} \n\n
        {npc} \n\n
        {heard_conversations}  \n\n
        {relation}  \n\n
        {output}   \n\n
        {conversations}""" 

