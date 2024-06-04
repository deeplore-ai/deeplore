from langchain_community.document_loaders import DirectoryLoader
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from transformers import pipeline
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

from .utils import getPrompt
from .classes import Speech

##### CREATE THE VECTOR STORE (RAG) ###################
text_splitter = RecursiveCharacterTextSplitter()

# Load first time to avoid NLTK delay
loader = DirectoryLoader('data', glob="**/static/*.txt")
docs = loader.load()

# Split text into chunks 
documents = text_splitter.split_documents(docs)
# Define the embedding model
#embeddings = MistralAIEmbeddings(model="mistral-embed", mistral_api_key=MISTRAL_API_KEY,)
EMBEDDING_MODEL_NAME = "openbmb/MiniCPM-Llama3-V-2_5"
tokenizer = AutoTokenizer.from_pretrained(EMBEDDING_MODEL_NAME)
embedding = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL_NAME,
    multi_process=True,
    model_kwargs={"device": "cuda"},
    encode_kwargs={"normalize_embeddings": True},  # Set `True` for cosine similarity
)

# Create the vector store 
vector = FAISS.from_documents(documents, embedding)
# Define a retriever interface
retriever = vector.as_retriever()


def chat_langchain_hugging_face(speech: Speech) -> str:
    """
    This function is responsible for creating a chain of LangChain components to answer questions.
    It uses a retrieval-augmented generation (RAG) approach, where a vector store (FAISS) is used to 
    retrieve relevant documents, and a language model (ChatGoogleGenerativeAI) is used to generate 
    answers based on the retrieved documents and the user's question.

    Parameters:
    speech (Speech): An instance of the Speech class, containing the content of the speech.

    Returns:
    str: The answer to the user's question.
    """

    # Define LLM
    
    model = AutoModelForCausalLM.from_pretrained(EMBEDDING_MODEL_NAME)

    READER_LLM = pipeline(
        model=model,
        tokenizer=tokenizer,
        task="text-generation",
        do_sample=True,
        temperature=0.9,
        repetition_penalty=1.1,
        return_full_text=False,
        max_new_tokens=300,
    )

    # Define prompt template
    RAG_PROMPT_TEMPLATE = tokenizer.apply_chat_template([{"""
        <context> {context} </context> \n
        Precisions :  {input} \n
        Question : {question}"""}], tokenize=False, #add_generation_prompt=True
    )

    # Create a retrieval chain to answer questions
    # The create_stuff_documents_chain function combines a language model and a prompt template
    # to generate a response based on a set of documents.
    
    retrieved = vector.similarity_search(query=speech.content)
    retrieved_docs_text = [doc.page_content for doc in retrieved]  # We only need the text of the documents
    context = "\nExtracted documents:\n"
    context += "".join([f"Document {str(i)}:::\n" + doc for i, doc in enumerate(retrieved_docs_text)])
    final_prompt = RAG_PROMPT_TEMPLATE.format(question=speech.content, input=getPrompt(speech), context=context)

    # Return the answer from the response
    return READER_LLM(final_prompt)[0]["generated_text"]