export async function createImageEmbedding(file) {
  const clipServiceUrl = process.env.CLIP_SERVICE_URL;

  if (!clipServiceUrl) {
    throw new Error("Missing CLIP_SERVICE_URL.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${clipServiceUrl}/embed-image`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CLIP service failed: ${text}`);
  }

  const payload = await response.json();

  if (!Array.isArray(payload.embedding)) {
    throw new Error("CLIP service returned an invalid embedding.");
  }

  return payload.embedding;
}
