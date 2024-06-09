from pathlib import Path

characters = ["Dieter_Hoffman", "Emma_Dubois", "Enzo_Muller", 
"Farida_Wang", "Ines_Dubois", "Johnatan_Chassang", 
"Laurent_Dubois", "Matthieu_Mancini", "Paul_Martinez"]

for character in characters:
    f = open(("data/heard_conversation_"+character+'.txt'), 'w', encoding='utf-8')
    f.write("*CONVERSATION ENTENDUE")
    f.close()
    f = open(("data/conversations_"+character+'.txt'), 'w', encoding='utf-8')
    f.write("*CONVERSATION")
    f.close()
    f = open(("data/npc_"+character+'.txt'), 'w', encoding='utf-8')
    f.write("*INFORMATION PNJ")
    f.close()
    f = open(("data/relations_"+character+'.txt'), 'w', encoding='utf-8')
    f.write("*RELATIONS")
    f.close()
