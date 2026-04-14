"use client";

import { useState, useEffect } from "react";
import ResultScreen from "./ResultScreen";
import { events } from "@/lib/meta-pixel";

const QUESTIONS = [
  {
    domain: "Cansancio",
    text: "¿Con qué frecuencia te levantas por la mañana con cansancio, aunque hayas dormido más de seis horas?",
  },
  {
    domain: "Digestión",
    text: "¿Cuántas veces notas que tu estómago o digestión empeoran justo en los momentos de más tensión o nervios, aunque no hayas comido nada diferente?",
  },
  {
    domain: "Estrés crónico",
    text: "¿Con qué frecuencia te sorprendes con los hombros tensos, la mandíbula apretada o la respiración corta, sin haber hecho ningún esfuerzo físico?",
  },
  {
    domain: "Sueño",
    text: "¿Cuántas veces te cuesta apagar la mente cuando intentas dormir, aunque notes el cuerpo agotado?",
  },
  {
    domain: "Desconexión",
    text: "¿Con qué frecuencia sientes que llevas el día en piloto automático, físicamente presente pero sin estar del todo aquí?",
  },
];

const OPTIONS = [
  { label: "Casi nunca", value: 1 },
  { label: "A veces", value: 2 },
  { label: "Con frecuencia", value: 3 },
  { label: "Casi siempre", value: 4 },
];

export type Level = "verde" | "amber" | "rojo";

function getLevel(score: number): Level {
  if (score <= 9) return "verde";
  if (score <= 14) return "amber";
  return "rojo";
}

export default function DiagnosticTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);

  useEffect(() => {
    events.viewContent();
  }, []);

  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  const handleSelect = (value: number) => {
    if (isTransitioning) return;
    setSelectedOption(value);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);

      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
        setQuestionKey((k) => k + 1);
        setIsTransitioning(false);
      } else {
        events.lead();
        setShowResult(true);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    const newAnswers = answers.slice(0, -1);
    setAnswers(newAnswers);
    setCurrentQuestion((prev) => prev - 1);
    setSelectedOption(null);
    setQuestionKey((k) => k + 1);
    setIsTransitioning(false);
  };

  if (showResult) {
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    const level = getLevel(totalScore);
    return <ResultScreen score={totalScore} level={level} />;
  }

  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(28,61,80,0.15)",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "48px",
        boxShadow: "0 4px 24px rgba(28,61,80,0.08)",
      }}
      className="px-5 md:px-8"
    >
      {/* Cabecera */}
      <div className="mb-5">
        <span
          style={{
            background: "#E1F5EE",
            color: "#085041",
            fontSize: "10px",
            padding: "4px 10px",
            borderRadius: "20px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "inline-block",
            fontFamily: "var(--font-dm-sans)",
            marginBottom: "12px",
          }}
        >
          Test Diagnóstico IEN
        </span>

        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "24px",
            fontWeight: 500,
            color: "#1C3D50",
            marginBottom: "6px",
          }}
        >
          ¿Está inhibido tu nervio vago?
        </h3>

        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "13px",
            color: "#8E9CA3",
            margin: 0,
          }}
        >
          5 preguntas · 2 minutos · Resultado personalizado
        </p>

        <div
          style={{
            borderTop: "1px solid rgba(28,61,80,0.1)",
            margin: "16px 0",
          }}
        />
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div
          style={{
            background: "rgba(28,61,80,0.08)",
            height: "4px",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#2B7A8B",
              height: "100%",
              width: `${progress}%`,
              borderRadius: "2px",
              transition: "width 400ms ease",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            color: "#8E9CA3",
            textAlign: "right",
            marginTop: "6px",
          }}
        >
          Pregunta {currentQuestion + 1} de {QUESTIONS.length}
        </p>
      </div>

      {/* Pregunta */}
      <div key={questionKey} className="question-in">
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            color: "#1A2326",
            lineHeight: 1.65,
            marginBottom: "20px",
            fontWeight: 400,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "10px",
              color: "#8E9CA3",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            {QUESTIONS[currentQuestion].domain}
          </span>
          {QUESTIONS[currentQuestion].text}
        </p>

        {/* Opciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option.value)}
              disabled={isTransitioning}
              style={{
                border:
                  selectedOption === option.value
                    ? "1px solid #1C3D50"
                    : "1px solid rgba(28,61,80,0.2)",
                borderRadius: "8px",
                padding: "14px 16px",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                color:
                  selectedOption === option.value ? "#1C3D50" : "#1A2326",
                fontWeight: selectedOption === option.value ? 500 : 400,
                background:
                  selectedOption === option.value
                    ? "rgba(28,61,80,0.05)"
                    : "white",
                cursor: isTransitioning ? "default" : "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (selectedOption !== option.value && !isTransitioning) {
                  e.currentTarget.style.borderColor = "#2B7A8B";
                  e.currentTarget.style.background = "rgba(43,122,139,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOption !== option.value) {
                  e.currentTarget.style.borderColor = "rgba(28,61,80,0.2)";
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navegación */}
      {currentQuestion > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handlePrevious}
            style={{
              background: "none",
              border: "1px solid rgba(28,61,80,0.2)",
              borderRadius: "8px",
              padding: "10px 20px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              color: "#8E9CA3",
              cursor: "pointer",
            }}
          >
            ← Anterior
          </button>
        </div>
      )}
    </div>
  );
}
