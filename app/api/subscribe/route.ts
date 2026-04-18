import { createClient } from "@supabase/supabase-js";
import { sendResultEmail } from "@/lib/send-email";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
    const { score, level } = body;

    if (!EMAIL_REGEX.test(email)) {
      return Response.json(
        { success: false, error: "invalid_email" },
        { status: 400 }
      );
    }

    // Comprobar si el lead ya existe (.maybeSingle devuelve null sin error si no hay filas)
    const { data: existing, error: lookupError } = await supabase
      .from("leads")
      .select("id, email_sequence, paid")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("Supabase lookup error:", lookupError);
      return Response.json(
        { success: false, error: "Error al consultar" },
        { status: 500 }
      );
    }

    if (existing) {
      // Actualizar sin tocar email_sequence ni paid
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          score,
          level,
          first_email_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return Response.json(
          { success: false, error: "Error al actualizar" },
          { status: 500 }
        );
      }
    } else {
      // Lead nuevo: insert completo
      const { error: insertError } = await supabase
        .from("leads")
        .insert([{
          email,
          score,
          level,
          paid: false,
          email_sequence: 0,
          first_email_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return Response.json(
          { success: false, error: "Error al guardar" },
          { status: 500 }
        );
      }
    }

    // Enviar email de resultado siempre (lead nuevo o repetidor)
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
