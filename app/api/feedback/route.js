import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const payload = await request.json();

    const { error } = await supabase.from("stock_match_feedback").insert({
      stock_item_id: payload.stockItemId,
      stock_code: payload.stockCode,
      similarity: payload.similarity,
      is_correct: Boolean(payload.isCorrect)
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected feedback error." }, { status: 500 });
  }
}
