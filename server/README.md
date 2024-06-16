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

# Environment variables

All used environment variables can be found in the server/app/config.py file. You can either set them directly in your system or use the .env.yaml file to include them in the application. An example of the .env.yaml file can be found in the server/.env.yaml.example file.

# Models

## Local model

To install a model in local and use in the application, please follow the instructions.

We are using **[Ollama](https://ollama.com/download)** to run our models in local on the local host.

Go on the [Ollama official website](https://ollama.com/download) to download ollama. On the official website you can see all the models available.  

Open a command prompt:  

```cmd.exe
ollama run [model_name]
```

Choose you model and that's it ! Now you have a model in your computer

## Online models

There is multiple ways to use online models. The recommended is gemini-1.5-pro.

To have it working, you will need to set the USE_LANGCHAIN to True and the MODEL_NAME to "gemini-1.5-pro".

You will also need an up and running google cloud account and you will need to be connected to it using the gcloud CLI ([full documentation](https://cloud.google.com/sdk/docs)).

You will also need to run this command :
```
gcloud auth application-default login
```
It will create a credential file that the google package will be able to find. If you want to specify a different folder for this file, you can change en evn variable `GOOGLE_APPLICATION_CREDENTIALS`.

# Data storage

By default, all data are stored locally. It contains conversations and heard conversations by the NPC. But if you deploy on the cloud, it's not recommended, you will lose data at each deployment. Instead you can use a Firestore database by setting the USE_FIRESTORE env var to True. But beware, it will also use this database as the source for your npc, context and instructions.

To see how it work, you can look at the server/app/infrastructure/datastore/FirestoreDatasource.py file.

# Run

In the requirements.txt file, you have installed *fastapi*. You will use it to run in local the back. The command line is :

```cmd.exe
fastapi dev app/main.py
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
