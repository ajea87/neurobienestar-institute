import { createClient } from "@supabase/supabase-js";
import { sendResultEmail } from "@/lib/send-email";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, score, level } = await req.json();

    // Validar email
    if (!email || !email.includes("@")) {
      return Response.json(
        { success: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    // Guardar en Supabase
    const { error } = await supabase
      .from("leads")
      .insert([{ email, score, level, paid: false }]);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { success: false, error: "Error al guardar" },
        { status: 500 }
      );
    }

    try {
      await sendResultEmail(email, level);
    } catch (emailErr) {
      console.error("Error enviando email de resultado:", emailErr);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return Response.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
