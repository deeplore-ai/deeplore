import pathlib
from ..classes import Model
from langchain_community.llms import Ollama
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

from ..utils import getPrompt, context
from ..classes import Speech
from ..config import DEBUG

from langchain.globals import set_debug

set_debug(True)

class OllamaSimple(Model):
    def __init__(self, model_name: str):
        super().__init__(model_name)
        self.model = ChatOllama(model=model_name, temperature=0, num_ctx=16000)
        self.chat = ChatPromptTemplate.from_template("""
        <context> {context} </context> \n
        Precisions :  {input} \n
        Question : {question}"""
    )

    def get_answer(self, speech: Speech):
        prompt = getPrompt(speech)
        chat = ChatPromptTemplate.from_messages(self.get_prompt(speech))
        chain = chat | self.model
        ai_message = chain.invoke({"input": prompt, "question": speech.content, "context": context})
        if DEBUG:
            print(ai_message.response_metadata)
        return ai_message.content
    
    def get_prompt(self, speech: Speech):
        print("Session id :", speech.id)
        concat_id = speech.firstname+'_'+speech.lastname
        conversations = open("data/provisoire/conversations_"+concat_id  + '_' + speech.id+'.txt', 'r', encoding='utf-8').read()
        heard_conversations = open("data/provisoire/heard_conversation_"+concat_id + '_' + speech.id+'.txt', 'r', encoding='utf-8').read()
        npc = open(pathlib.Path("data/static/npc/npc_"+concat_id + '.txt'), 'r', encoding='utf-8').read()
        comportement = open(pathlib.Path("data/static/comportement/comportement_"+concat_id + '.txt'), 'r', encoding='utf-8').read()
        context = open(pathlib.Path("data/static/context.txt"), 'r', encoding='utf-8').read()
        instructions = open(pathlib.Path("data/static/instructions.txt"), 'r', encoding='utf-8').read()

        messages  = [
            ("system", context),
            ("system", "You are " + speech.firstname + " " + speech.lastname),
            ("system", npc),
            ("system", comportement),
            ("system", "You heard these conversations :\n " + heard_conversations),
            ("system", "You had theses conversations :\n " + conversations),
            ("system", instructions),
            ("human", speech.content)
        ]

        return messages
