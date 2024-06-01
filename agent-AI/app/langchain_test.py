from langchain_community.document_loaders import DirectoryLoader
from langchain_mistralai.chat_models import ChatMistralAI
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain

from .config import MISTRAL_API_KEY, DEBUG
from .classes import Speech, test_speech

text_splitter = RecursiveCharacterTextSplitter()

# Load first time to avoid NLTK delay
loader = DirectoryLoader('data', glob="**/*.txt")
docs = loader.load()
# Split text into chunks 
documents = text_splitter.split_documents(docs)
# Define the embedding model
embeddings = MistralAIEmbeddings(model="mistral-embed", mistral_api_key=MISTRAL_API_KEY)
# Create the vector store 
vector = FAISS.from_documents(documents, embeddings)
# Define a retriever interface
retriever = vector.as_retriever()


def chat_langchain(speech: Speech):
    # Load data
    loader = DirectoryLoader('data', glob="**/*.txt")
    docs = loader.load()

    # for document in docs:
    #     print("Document source:", document.metadata.get('source', 'Unknown'))
    #     # print("Page content:", document.page_content)
    #     print()  # Add a new line between documents

    # Split text into chunks 
    documents = text_splitter.split_documents(docs)
    # Define the embedding model
    embeddings = MistralAIEmbeddings(model="mistral-embed", mistral_api_key=MISTRAL_API_KEY)
    # Create the vector store 
    vector = FAISS.from_documents(documents, embeddings)

    # Define a retriever interface
    retriever = vector.as_retriever()
    # Define LLM
    model = ChatMistralAI(mistral_api_key=MISTRAL_API_KEY)
    # Define prompt template
    prompt = ChatPromptTemplate.from_template("""

    <context>
    {context}
    </context>

    You : {you}
    Speaker : {speaker}
    
    Speech: {input}""")

    # Create a retrieval chain to answer questions
    document_chain = create_stuff_documents_chain(model, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    response = retrieval_chain.invoke({"input": speech.content, "speaker": speech.speaker, "you": speech.firstname + " " + speech.lastname})
    return response["answer"]