# CLIP Service

This service wraps OpenAI CLIP and returns normalized image embeddings for the Next.js app.

## Recommended Hosting

Use Hugging Face Spaces with the Docker SDK option.

The public Space URL becomes your app's `CLIP_SERVICE_URL`, for example:

```env
CLIP_SERVICE_URL=https://your-name-stock-code-clip-service.hf.space
```

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

## Hugging Face Spaces

1. Create a new Space.
2. Choose `Docker` as the SDK.
3. Upload `app.py`, `requirements.txt`, `Dockerfile`, and `.dockerignore`.
4. Wait for the build to finish.
5. Open `/health` on the Space URL to confirm it is live.
