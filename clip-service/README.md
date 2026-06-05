---
title: StockSearch
colorFrom: green
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# CLIP Service

This service wraps OpenCLIP and returns normalized image embeddings for the Next.js app.

The default model is:

```text
CLIP_MODEL_NAME=ViT-B-32
CLIP_PRETRAINED=laion2b_s34b_b79k
```

It returns 512-dimensional embeddings, so it works with the existing Supabase schema.

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

Expected live health response:

```json
{
  "ok": true,
  "device": "cpu",
  "model": "ViT-B-32",
  "pretrained": "laion2b_s34b_b79k",
  "embedding_dim": 512
}
```

## Hugging Face Spaces

1. Create a new Space.
2. Choose `Docker` as the SDK.
3. Upload `app.py`, `requirements.txt`, `Dockerfile`, and `.dockerignore`.
4. Wait for the build to finish.
5. Open `/health` on the Space URL to confirm it is live.
