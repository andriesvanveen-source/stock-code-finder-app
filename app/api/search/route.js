import { createImageEmbedding } from "@/lib/image-embedding";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function vectorLiteral(values) {
  return `[${values.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || image.size === 0) {
      return Response.json({ error: "Search image is required." }, { status: 400 });
    }

    const embedding = await createImageEmbedding(image);

    const { data, error } = await supabase.rpc("match_stock_images", {
      query_embedding: vectorLiteral(embedding),
      match_count: 5
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ matches: data || [] });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected search error." }, { status: 500 });
  }
}
