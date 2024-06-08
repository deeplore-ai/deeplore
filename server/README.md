# Setup

## Python 
The first thing to do is to install the python above the version 3.10

### Official website
For this, you can go on the [official website](https://www.python.org/downloads/). Then download the version you want. Follow the steps.

### Chocolatey
Chocolatey install it for you :  

```PowerShell
choco install python
```

### Anaconda
I don't recommend using this.  

### Verify 
To verify if python is installed, open a command prompt :

```cmd.exe
python
```

You should have an respond as this :  

```text
Python 3.12.2 (tags/v3.12.2:6abddd9, Feb  6 2024, 21:26:36) [MSC v.1937 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
```

## Cuda

Not used for now. If you want to use, follow the [official documentation Torch](https://pytorch.org/get-started/locally/)

## Environment python

Open a command prompt et se rendre dans le dossier "server":  

```cmd.exe
cd deeplore/server
```

Create the environment by the name ".venv":  

```cmd.exe
python -m venv .venv
```

Then activate the environment:  

```cmd.exe
.venv\Scripts\Activate
```

In the [requirements file](https://github.com/deeplore-ai/deeplore/blob/master/server/README.md) you will find the librairies required. To install it, do this command in the environment :  

```cmd.exe
pip install -r requirements.txt
```

# Local 

## Model

To install a model in local and use in the application, please follow the instructions.

We are using **[Ollama](https://ollama.com/download)** to run our models in local on the local host.

Go on the [Ollama official website](https://ollama.com/download) to download ollama. On the official website you can see all the models available.  

Open a command prompt:  

```cmd.exe
ollama run [model_name]
```

Choose you model and that's it ! Now you have a model in your computer

## FastAPI run

In the requirements.txt file, you have installed *fastapi*. You will use it to run in local the back. The command line is :

```cmd.exe
fastapi dev app/main.py
```

# Online

If you choose to use an online model with there APIs. Please, set the environment variables in a `.env.yaml` file.

```bash
cp .env.yaml.example .env.yaml
```

Put your API key in the file.

# Config

In the [.env.file](.env.yaml.example), adpat those lines to correspond to your setup :  

```python
# Serveur adresse
SERVEUR_ADRESSE: "http://localhost:8000" # Serveur adresse where the back is hosted (default in local with fastapi)
LOCAL: True # Boolean to indicate if the model is local or not
MODEL_NAME: "llama3-chatqa:70b" # Model name used for the chatbot
```

# Deployment

To deploy the app, use

```bash
docker build -t fastapi-app .
docker run -p 8000:8000 fastapi-app 
```

## Online deployment

To deploy the app online, setup gcloud CLI and use

```bash
gcloud run deploy app --port 8080 --source . --env-vars-file .env.yaml --region europe-west9
```
