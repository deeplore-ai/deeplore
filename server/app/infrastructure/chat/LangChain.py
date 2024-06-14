import os
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain_community.embeddings import OllamaEmbeddings
from langchain_google_vertexai import VertexAIEmbeddings, VertexAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_mistralai.chat_models import ChatMistralAI
from langchain_community.llms import Ollama
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from ...domain import BaseChat, BaseDatastore

class LangChain(BaseChat):
    def __init__(self, datastore: BaseDatastore):
        embeddings = LangchainFactory().getEmbeddings()
        try:
            vector = FAISS.load_local("data/provisoire/vector_store", embeddings, allow_dangerous_deserialization=True)
        except:
            text_splitter = RecursiveCharacterTextSplitter()
            world_info = datastore.get_vectorizable_content()
            print(datastore)
            splitted_world_info = text_splitter.split_text(world_info)
            vector = FAISS.from_texts(splitted_world_info, embeddings)
            vector.save_local("data/provisoire/vector_store.faiss")
        
        # Define a retriever interface
        self.retriever = vector.as_retriever()
    
    def chat(self, prompt: str):
        promptTemplate = ChatPromptTemplate.from_template("""
            <context> {context} </context> \n {input}"""
        )

        model = LangchainFactory().getModel()
        # Create a retrieval chain to answer questions
        # The create_stuff_documents_chain function combines a language model and a prompt template
        # to generate a response based on a set of documents.
        document_chain = create_stuff_documents_chain(model, promptTemplate)

        # Create a retrieval-augmented chain
        # The create_retrieval_chain function combines a retriever and a document chain to generate
        # a response based on a set of documents retrieved from the retriever.
        retrieval_chain = create_retrieval_chain(self.retriever, document_chain)

        # Invoke the retrieval-augmented chain
        # The invoke method of the retrieval_chain is used to generate a response based on the input
        # parameters. In this case, the input parameters are the user's question and the prompt for the
        # language model.
        response = retrieval_chain.invoke({"input": prompt})

        # Return the answer from the response
        return response["answer"]

class LangchainFactory:
    def getEmbeddings(self):
        model_name = os.getenv("MODEL_NAME")
        if os.getenv("LOCAL") is not None and os.getenv("LOCAL") == "true" :
            return OllamaEmbeddings(model=model_name)
        elif "gemini" in model_name :
            return VertexAIEmbeddings(model="text-embedding-004", project=os.getenv("GOOGLE_PROJECT_NAME"))
        elif "mistral" in model_name :
            return MistralAIEmbeddings(model=model_name, mistral_api_key=os.getenv("MISTRAL_API_KEY"),)
        elif "gpt" in model_name :
            return OpenAIEmbeddings(model="text-embedding-3-large")
        else:
            raise ValueError(f"Model {model_name} not supported")

    def getModel(self):
        temperature = 0.4
        model_name = os.getenv("MODEL_NAME")
        if "mistral" in model_name :
            return ChatMistralAI(model=model_name, mistral_api_key=os.getenv("MISTRAL_API_KEY"), temperature=temperature)
        elif "gemini" in model_name :
            return VertexAI(model=model_name, temperature=temperature)
        elif os.getenv("LOCAL") is not None and os.getenv("LOCAL") == "true" :
            return Ollama(model=model_name, temperature=temperature, num_ctx=8192)
        elif "gpt" in model_name :
            return ChatOpenAI(model=model_name, temperature=temperature)
        else:
            raise ValueError(f"Model {model_name} not supported")