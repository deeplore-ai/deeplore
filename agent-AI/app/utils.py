import json 
import os
import pathlib

context = open(pathlib.Path("data/context.txt"), 'r').read()
output = open(pathlib.Path("data/context.txt"), 'r').read()


def getPrompt(Speech):
    concat_id = Speech.firstname+'_'+Speech.lastname+'.txt'
    conversations = open("data/conversations"+concat_id, 'r').read()
    heard_conversations = open("data/heard_conversations"+concat_id, 'r').read()
    npc = open("data/npc"+concat_id, 'r').read()
    relation = open("data/relation"+concat_id, 'r').read()

    return f"""{context} \n\n
        {npc} \n\n
        {heard_conversations}  \n\n
        {relation}  \n\n
        {output}   \n\n
        {conversations}""" 

