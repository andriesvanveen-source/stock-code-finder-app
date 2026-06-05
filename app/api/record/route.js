import { createImageEmbedding } from "@/lib/image-embedding";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function vectorLiteral(values) {
  return `[${values.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();
    const images = formData.getAll("images").filter((file) => file && file.size > 0);
    const stockCode = String(formData.get("stockCode") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const location = String(formData.get("location") || "").trim();

    if (!stockCode || images.length === 0) {
      return Response.json({ error: "Stock code and at least one image are required." }, { status: 400 });
    }

    const { data: item, error: itemError } = await supabase
      .from("stock_items")
      .insert({
        stock_code: stockCode,
        description,
        category,
        store_location: location
      })
      .select()
      .single();

    if (itemError) {
      return Response.json({ error: itemError.message }, { status: 500 });
    }

    const imageRows = [];

    for (const image of images) {
      const embedding = await createImageEmbedding(image);
      const extension = image.name?.split(".").pop() || "jpg";
      const path = `${item.id}/${crypto.randomUUID()}-${safeName(image.name || `image.${extension}`)}`;
      const arrayBuffer = await image.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("stock-images")
        .upload(path, arrayBuffer, {
          contentType: image.type || "image/jpeg",
          upsert: false
        });

      if (uploadError) {
        return Response.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage.from("stock-images").getPublicUrl(path);

      imageRows.push({
        stock_item_id: item.id,
        image_path: path,
        image_url: publicUrl.publicUrl,
        embedding: vectorLiteral(embedding)
      });
    }

    const { error: imageError } = await supabase.from("stock_item_images").insert(imageRows);

    if (imageError) {
      return Response.json({ error: imageError.message }, { status: 500 });
    }

    return Response.json({ item, imageCount: imageRows.length });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected recording error." }, { status: 500 });
  }
}
