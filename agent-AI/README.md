# Using fast AI and docker

https://dev.to/0xnari/deploying-fastapi-app-with-google-cloud-run-13f3

## Setup

Python 3.10+ is required. Docker is required for deployment.

For local dev, use

```bash
pip install -r requirements.txt
```

## Running

To run the app locally, use

```bash
uvicorn app/main:app --reload
```

## Deployment

To deploy the app, use

```bash
docker build -t fastapi-app .
docker run -p 8000:8000 fastapi-app
```

## Online deployment

To deploy the app online, setup gcloud CLI and use

```bash
gcloud run deploy app --port 8080 --source .
```



