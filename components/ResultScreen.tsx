"use client";

import { useState } from "react";
import type { Level } from "./DiagnosticTest";

interface ResultScreenProps {
  score: number;
  level: Level;
}

const RESULTS = {
  verde: {
    pill: {
      bg: "#EAF3DE",
      color: "#27500A",
      text: "Nivel Verde · Señales tempranas",
    },
    borderColor: "#639922",
    ctaBg: "#EAF3DE",
    ctaColor: "#3B6D11",
    title: "Tu sistema nervioso todavía avisa — y eso es una ventaja.",
    body: [
      "Lo que muestran tus respuestas es importante: tu nervio vago ya está enviando señales de que algo no está del todo equilibrado. No es una crisis. Es una oportunidad.",
      "La mayoría de personas que llegan aquí con un nivel como el tuyo ignoran estas señales durante meses — hasta que el sistema se satura. Tú has llegado antes.",
      "El Protocolo Nervio Vago es exactamente para este momento: cuando el cuerpo todavía tiene margen para reajustarse con facilidad, sin que cueste esfuerzo ni tiempo. Son 7 técnicas que puedes aplicar hoy — algunas en menos de 60 segundos.",
    ],
    ctaButton: "Quiero el Protocolo ahora →",
  },
  amber: {
    pill: {
      bg: "#FAEEDA",
      color: "#633806",
      text: "Nivel Ámbar · Activación crónica",
    },
    borderColor: "#BA7517",
    ctaBg: "#FAEEDA",
    ctaColor: "#633806",
    title: "Tu nervio vago lleva tiempo pidiendo atención. Ya es hora de escucharlo.",
    body: [
      "Las respuestas que has dado describen algo que muy poca gente consigue poner en palabras: esa sensación de estar funcionando, pero no del todo. De dormir y no descansar. De querer desconectar y no poder.",
      "No es agotamiento normal. No es estrés pasajero. Es tu sistema nervioso autónomo en activación crónica — y tiene un nombre concreto: nervio vago inhibido.",
      "El Protocolo Nervio Vago reúne las 7 técnicas más efectivas para activar el nervio vago de forma voluntaria. Técnicas basadas en evidencia, sin terminología médica, diseñadas para personas que no tienen tiempo ni ganas de complicarse. Algunas producen un cambio perceptible en menos de un minuto.",
      "El primer paso es siempre el más difícil. Este puede ser en los próximos diez minutos.",
    ],
    ctaButton: "Quiero activar mi nervio vago →",
  },
  rojo: {
    pill: {
      bg: "#FCEBEB",
      color: "#791F1F",
      text: "Nivel Rojo · Modo supervivencia",
    },
    borderColor: "#E24B4A",
    ctaBg: "#FCEBEB",
    ctaColor: "#791F1F",
    title: "Tu cuerpo lleva demasiado tiempo en modo supervivencia. Y tiene solución.",
    body: [
      "Lo que acabas de describir en este test no es \"mucho estrés\". Es un sistema nervioso autónomo que ha estado en alerta durante tanto tiempo que ya no sabe cómo salir solo.",
      "El cansancio que no se va con dormir. La digestión que reacciona a cualquier tensión. La mente que sigue girando cuando el cuerpo ya no puede más. Esto no lo causa la falta de voluntad ni de organización. Lo causa un nervio — el nervio vago — que lleva meses o años sin activarse correctamente.",
      "La buena noticia es que este nervio responde. Y lo hace rápido cuando sabes cómo tocarlo. El Protocolo IEN es el mapa más claro y directo que existe: 7 técnicas ordenadas por impacto, para personas que ya lo han intentado todo.",
      "Si hay un momento para hacer esto, es ahora.",
    ],
    ctaButton: "Necesito este protocolo →",
  },
};

export default function ResultScreen({ score, level }: ResultScreenProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = RESULTS[level];

  const handleCTAClick = () => {
    setShowEmailForm(true);
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Introduce un email válido.");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score, level }),
      });
      const stripeLink =
        process.env.NEXT_PUBLIC_STRIPE_LINK ||
        "https://buy.stripe.com/PLACEHOLDER";
      window.location.href = stripeLink;
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        background: "white",
        border: "1px solid rgba(28,61,80,0.15)",
        borderRadius: "12px",
        borderTop: `3px solid ${result.borderColor}`,
        padding: "32px",
        marginBottom: "48px",
        boxShadow: "0 4px 24px rgba(28,61,80,0.08)",
      }}
    >
      {/* Pill de nivel */}
      <span
        style={{
          background: result.pill.bg,
          color: result.pill.color,
          fontSize: "11px",
          padding: "5px 12px",
          borderRadius: "20px",
          letterSpacing: "0.05em",
          display: "inline-block",
          fontFamily: "var(--font-dm-sans)",
          marginBottom: "16px",
          fontWeight: 500,
        }}
      >
        {result.pill.text}
      </span>

      {/* Titular */}
      <h3
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "26px",
          fontWeight: 500,
          color: "#1C3D50",
          lineHeight: 1.25,
          marginBottom: "20px",
        }}
      >
        {result.title}
      </h3>

      {/* Cuerpo */}
      <div style={{ marginBottom: "24px" }}>
        {result.body.map((paragraph, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "15px",
              color: "#1A2326",
              lineHeight: 1.8,
              marginBottom: i < result.body.length - 1 ? "16px" : 0,
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* CTA Box */}
      <div
        style={{
          background: result.ctaBg,
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {!showEmailForm ? (
          <>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "13px",
                color: result.ctaColor,
                marginBottom: "14px",
              }}
            >
              Acceso inmediato · PDF descargable · 7€ pago único
            </p>
            <button
              onClick={handleCTAClick}
              style={{
                background: "#B8722E",
                color: "#F4EFE6",
                borderRadius: "30px",
                padding: "14px 32px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {result.ctaButton}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="fade-in">
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                color: "#1A2326",
                marginBottom: "12px",
              }}
            >
              Introduce tu email para recibir el PDF inmediatamente tras el pago.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{
                border: emailError
                  ? "1px solid #E24B4A"
                  : "1px solid rgba(28,61,80,0.25)",
                borderRadius: "8px",
                padding: "14px 16px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "15px",
                width: "100%",
                outline: "none",
                color: "#1A2326",
                background: "white",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2B7A8B";
              }}
              onBlur={(e) => {
                if (!emailError) {
                  e.target.style.borderColor = "rgba(28,61,80,0.25)";
                }
              }}
            />

            {emailError && (
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  color: "#E24B4A",
                  marginTop: "6px",
                }}
              >
                {emailError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "#B8722E",
                color: "#F4EFE6",
                borderRadius: "30px",
                padding: "16px 32px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "15px",
                fontWeight: 500,
                border: "none",
                cursor: isSubmitting ? "default" : "pointer",
                width: "100%",
                marginTop: "12px",
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? "Procesando..." : "Acceder al Protocolo por 7€ →"}
            </button>

            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "10px",
                color: "#8E9CA3",
                marginTop: "10px",
                lineHeight: 1.5,
              }}
            >
              Al continuar aceptas que el IEN guarde tu email para enviarte el PDF.
              Sin spam. Puedes darte de baja en cualquier momento.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
