"use client";

import Image from "next/image";
import DiagnosticTest from "./DiagnosticTest";

const LogoLight = () => (
  <svg
    viewBox="0 0 80 108"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-11"
  >
    <path
      d="M40,6 C39.4,28 40.6,62 40,102"
      stroke="#F4EFE6"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40,24 C36.5,23 31,21 25,18.5"
      stroke="#F4EFE6"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40,24 C43.5,23 49,21 55,18.5"
      stroke="#F4EFE6"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40,52 C44.5,51 51,53 57.5,56.5"
      stroke="#F4EFE6"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40,76 C36,77 30,80 23.5,83"
      stroke="#F4EFE6"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M40,76 C44,77 50,80 56.5,83"
      stroke="#F4EFE6"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="40" cy="24" r="3" fill="#F4EFE6" />
    <circle cx="40" cy="52" r="3" fill="#F4EFE6" />
    <circle cx="40" cy="76" r="3" fill="#F4EFE6" />
  </svg>
);

export default function Advertorial() {
  return (
    <div style={{ background: "#F4EFE6", minHeight: "100vh" }}>
      {/* SECCIÓN 1 — NAVBAR */}
      <nav
        style={{
          background: "#1C3D50",
          height: "56px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "2px solid #2B7A8B",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo izquierda */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LogoLight />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "22px",
                  color: "#F4EFE6",
                  letterSpacing: "0.15em",
                  lineHeight: 1.1,
                }}
              >
                IEN
              </div>
              <div
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "9px",
                  color: "rgba(244,239,230,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                neurobienestar.institute
              </div>
            </div>
          </div>

          {/* Badge derecha */}
          <span
            style={{
              background: "rgba(43,122,139,0.3)",
              color: "#9FE1CB",
              fontSize: "10px",
              padding: "5px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Artículo científico
          </span>
        </div>
      </nav>

      {/* SECCIÓN 2 — CABECERA DEL ARTÍCULO */}
      <section
        className="fade-up"
        style={{
          background: "#F4EFE6",
          paddingTop: "48px",
          paddingBottom: "0",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* Categoría */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#2B7A8B",
              marginBottom: "20px",
            }}
          >
            NEUROBIOLOGÍA · SISTEMA NERVIOSO
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 500,
              color: "#1C3D50",
              lineHeight: 1.15,
              marginBottom: "20px",
            }}
            className="text-[30px] md:text-[42px]"
          >
            El nervio que lleva años intentando decirte algo.
            <br />Y que nadie te había explicado.
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "17px",
              fontWeight: 300,
              color: "#444441",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            La ciencia del estrés crónico tiene una causa específica.
            <br />
            Se llama nervio vago inhibido. Y tiene solución — en 60 segundos.
          </p>

          {/* Metadatos */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              color: "#8E9CA3",
              marginBottom: "8px",
            }}
          >
            Instituto Español de Neurobienestar · neurobienestar.institute ·
            Actualizado abril 2025
          </p>

          {/* Línea divisoria con disclaimer */}
          <div
            style={{
              borderTop: "1px solid rgba(28,61,80,0.12)",
              borderBottom: "1px solid rgba(28,61,80,0.12)",
              paddingTop: "12px",
              paddingBottom: "12px",
              marginBottom: "0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                fontStyle: "italic",
                color: "#8E9CA3",
                margin: 0,
              }}
            >
              Este artículo contiene información científica revisada por el
              equipo del IEN. Al final encontrarás un test diagnóstico gratuito.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3 — IMAGEN HERO */}
      <section
        className="fade-up"
        style={{ animationDelay: "100ms", opacity: 0 }}
      >
        <div
          className="relative h-[420px] md:h-[560px] overflow-hidden"
        >
          {/* Imagen de fondo */}
          <Image
            src="/hero-new.jpg"
            alt="Mujer descansando, fatiga crónica, nervio vago"
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />

          {/* Overlay degradado */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(28,61,80,0.1) 0%, rgba(28,61,80,0.65) 100%)",
            }}
          />

          {/* Texto superpuesto */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: 0,
              right: 0,
            }}
          >
            <div
              style={{
                maxWidth: "680px",
                margin: "0 auto",
                padding: "0 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "20px",
                  fontStyle: "italic",
                  color: "#F4EFE6",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                ¿Te levantas con cansancio aunque hayas dormido? Tu cuerpo no está
                roto.
                <br />
                Está enviando una señal que aún no has aprendido a leer.
              </p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            background: "#F4EFE6",
            textAlign: "center",
            padding: "10px 20px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              color: "#8E9CA3",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            La fatiga que no mejora con descanso es una de las señales más
            frecuentes de nervio vago inhibido. · IEN · neurobienestar.institute
          </p>
        </div>
      </section>

      {/* SECCIÓN 4 — CUERPO DEL ARTÍCULO */}
      <section
        className="fade-up"
        style={{ animationDelay: "200ms", opacity: 0 }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "40px 20px 0",
            fontFamily: "var(--font-dm-sans)",
            fontSize: "17px",
            color: "#1A2326",
            lineHeight: 1.85,
          }}
        >
          {/* Párrafos 1–2 */}
          <p style={{ marginBottom: "24px" }}>
            Probablemente llevas meses — quizás años — con una sensación que no
            sabes exactamente cómo describir. Las analíticas
            salen bien. El médico te dice que estás bien. Y sin embargo algo no
            funciona del todo. Te despiertas con cansancio. Tu estómago reacciona
            cuando hay tensión. Tu mente no para cuando quieres dormir. Llevas
            el día en piloto automático.
          </p>

          <p style={{ marginBottom: "36px" }}>
            No es ansiedad, aunque lo parece. No es depresión, aunque a veces
            lo roza. Es algo más específico. Y tiene nombre.
          </p>

          {/* H2 */}
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "26px",
              fontWeight: 500,
              color: "#1C3D50",
              margin: "36px 0 16px",
              lineHeight: 1.2,
            }}
          >
            El nervio que nadie te mencionó en la consulta
          </h2>

          <p style={{ marginBottom: "24px" }}>
            El nervio vago es el nervio más largo del cuerpo humano. Sale del
            tronco encefálico, baja por el cuello y llega hasta el abdomen,
            conectando el cerebro con el corazón, los pulmones y el sistema
            digestivo. Es el cable principal del sistema nervioso parasimpático
            — el sistema que te permite descansar, digerir, recuperarte y
            sentirte presente.
          </p>

          <p style={{ marginBottom: "24px" }}>
            Cuando el nervio vago tiene buen tono — lo que los investigadores
            llaman alta variabilidad de la frecuencia cardíaca — el cuerpo sabe
            cómo salir del estado de alerta. Sabe cómo volver a la calma
            después de un momento de estrés. Sabe cómo descansar de verdad.
          </p>

          <p style={{ marginBottom: "32px" }}>
            Cuando el nervio vago está inhibido — por estrés crónico, sobrecarga
            cognitiva sostenida o años sin regulación consciente — el cuerpo
            queda atrapado en modo supervivencia. No como una crisis. Como un
            estado permanente de fondo.
          </p>

          {/* Blockquote destacado */}
          <blockquote
            style={{
              background: "white",
              borderLeft: "3px solid #2B7A8B",
              padding: "24px 28px",
              borderRadius: "0 8px 8px 0",
              margin: "32px 0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "20px",
                fontStyle: "italic",
                color: "#1C3D50",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              &ldquo;El cansancio que no mejora con dormir.
              <br />
              El estómago que se altera sin razón aparente.
              <br />
              La mente que no para aunque el cuerpo no pueda más.
              <br />
              No son síntomas separados. Son la misma señal.&rdquo;
            </p>
          </blockquote>

          {/* H2 */}
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "26px",
              fontWeight: 500,
              color: "#1C3D50",
              margin: "36px 0 16px",
              lineHeight: 1.2,
            }}
          >
            El problema no es tu fuerza de voluntad
          </h2>

          <p style={{ marginBottom: "24px" }}>
            Durante años, la respuesta estándar al estrés crónico ha sido: haz
            ejercicio, medita, duerme más, preocúpate menos. Y aunque todo eso
            ayuda, ninguno de esos consejos toca el mecanismo real. Porque el
            problema no está en tus hábitos — está en tu sistema nervioso
            autónomo, que opera por debajo de la conciencia y del esfuerzo.
          </p>

          <p style={{ marginBottom: "36px" }}>
            No puedes &ldquo;decidir&rdquo; activar tu nervio vago igual que no puedes
            decidir bajar tu presión arterial. Pero sí puedes estimularlo de
            forma voluntaria. El nervio vago tiene vías de acceso físicas y
            precisas — y responde en segundos cuando sabes dónde y cómo tocarlo.
          </p>

          {/* H2 */}
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "26px",
              fontWeight: 500,
              color: "#1C3D50",
              margin: "36px 0 16px",
              lineHeight: 1.2,
            }}
          >
            El Método MAV: Micro-Activación Vagal
          </h2>

          <p style={{ marginBottom: "24px" }}>
            El Instituto Español de Neurobienestar ha desarrollado el Método MAV
            — Micro-Activación Vagal — un sistema de técnicas diseñadas para
            activar el nervio vago de forma directa, en cualquier momento, sin
            equipamiento y sin meditación prolongada.
          </p>

          <p style={{ marginBottom: "32px" }}>
            La diferencia con otros enfoques es estructural. El nervio vago no
            mejora su tono por el tiempo que le dedicas. Mejora por la
            frecuencia y precisión del estímulo. Un estímulo correcto de 60
            segundos, repetido, produce más efecto fisiológico que una sesión de
            meditación de 45 minutos realizada una vez a la semana.
          </p>

          {/* Cards MAV 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              {
                num: "01",
                title: "INTERRUPCIÓN DEL PATRÓN",
                text: "Cada micro-activación rompe el ciclo de alerta crónica antes de que empieces la técnica.",
              },
              {
                num: "02",
                title: "LA VENTANA VAGAL",
                text: "El cerebro instala con más facilidad lo que puede ejecutar de inmediato. Absorción máxima, sobrecarga cero.",
              },
              {
                num: "03",
                title: "REPETICIÓN SIN RESISTENCIA",
                text: "El tono vagal se construye por frecuencia, no por duración. La brevedad hace que repetir sea inevitable.",
              },
              {
                num: "04",
                title: "INSTALACIÓN PERMANENTE",
                text: "Cuando la técnica llega sin ruido cognitivo, el sistema nervioso la integra más rápido y de forma duradera.",
              },
            ].map((card) => (
              <div
                key={card.num}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  borderTop: "2px solid #2B7A8B",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "28px",
                    color: "#2B7A8B",
                    lineHeight: 1,
                  }}
                >
                  {card.num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1C3D50",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "8px 0 6px",
                  }}
                >
                  {card.title}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "13px",
                    color: "#5F5E5A",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          {/* Imagen neural después de cards MAV */}
          <div style={{ margin: "8px 0 32px" }}>
            <Image
              src="/neural.jpg"
              alt="Red neural IEN"
              width={680}
              height={320}
              style={{
                objectFit: "cover",
                borderRadius: "8px",
                width: "100%",
                height: "auto",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                fontStyle: "italic",
                color: "#8E9CA3",
                textAlign: "center",
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              Patrón de ramificación neural · IEN · neurobienestar.institute
            </p>
          </div>

          {/* Párrafo 10 */}
          <p style={{ marginBottom: "24px" }}>
            El Protocolo Nervio Vago del IEN recoge las 7 micro-activaciones
            principales, ordenadas por impacto, con instrucciones exactas de
            aplicación. Pero antes de presentártelas, tiene sentido que
            compruebes en qué punto está tu nervio vago ahora mismo.
          </p>

          {/* Párrafo de transición al test */}
          <div
            style={{
              background: "rgba(43,122,139,0.08)",
              borderRadius: "8px",
              padding: "24px",
              margin: "32px 0",
              border: "1px solid rgba(43,122,139,0.2)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "15px",
                color: "#1C3D50",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              El siguiente test diagnóstico evalúa 5 síntomas específicos del
              nervio vago inhibido. No requiere conocimientos previos. Tarda
              menos de 2 minutos. El resultado es personalizado según tu
              puntuación.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5+6+7 — TEST + RESULTADO + EMAIL */}
      <section
        className="fade-up"
        style={{ animationDelay: "300ms", opacity: 0 }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <DiagnosticTest />
        </div>
      </section>

      {/* SECCIÓN 9 — FOOTER */}
      <footer
        style={{
          background: "#1C3D50",
          padding: "32px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Logo + nombre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <LogoLight />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "20px",
                  color: "#F4EFE6",
                  letterSpacing: "0.15em",
                }}
              >
                IEN
              </div>
              <div
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "9px",
                  color: "rgba(244,239,230,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                neurobienestar.institute
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(244,239,230,0.1)",
              paddingTop: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                color: "rgba(244,239,230,0.4)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              © 2025 Instituto Español de Neurobienestar · Método MAV
              <br />
              El contenido de esta página es informativo y no constituye
              asesoramiento médico.
              <br />
              neurobienestar.institute
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
