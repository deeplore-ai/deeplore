import json 
import os
import pathlib

context = open(pathlib.Path("data/context.txt"), 'r')
output = open(pathlib.Path("data/context.txt"), 'r')


def getPrompt(prenom, nom):
    list_files = os.listdir(pathlib.Path("data"))
