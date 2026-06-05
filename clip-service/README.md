# CLIP Service

This service wraps the local OpenAI CLIP repo and returns normalized image embeddings for the Next.js app.

## Install

```bash
pip install -r requirements.txt
pip install C:/Users/andvee/Downloads/CLIP-main/CLIP-main
```

## Run

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```
