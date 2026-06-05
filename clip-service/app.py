import io
import os
from typing import List

import open_clip
import torch
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI(title="Stock Code CLIP Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = os.getenv("CLIP_MODEL_NAME", "ViT-B-32")
pretrained = os.getenv("CLIP_PRETRAINED", "laion2b_s34b_b79k")
model, _, preprocess = open_clip.create_model_and_transforms(
    model_name,
    pretrained=pretrained,
    device=device,
)
model.eval()
embedding_dim = getattr(model.visual, "output_dim", 512)


@app.get("/health")
def health():
    return {
        "ok": True,
        "device": device,
        "model": model_name,
        "pretrained": pretrained,
        "embedding_dim": embedding_dim,
    }


@app.post("/embed-image")
async def embed_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        features = model.encode_image(image_input)
        features = features / features.norm(dim=-1, keepdim=True)

    embedding: List[float] = features[0].cpu().tolist()
    return {"embedding": embedding}
