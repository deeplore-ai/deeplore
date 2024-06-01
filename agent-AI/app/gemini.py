import google.generativeai as genai
import os

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(name='gemini-pro')
response = model.generate_content('Please summarise this document: ...')

print(response.text)


def chat(speech: Speech):
     

    
    chat_response = model.generate_content()  
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content