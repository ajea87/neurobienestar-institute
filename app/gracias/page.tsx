export default function GraciasPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4EFE6',
      fontFamily: 'Georgia, serif'
    }}>

      {/* Navbar */}
      <nav style={{
        background: '#1C3D50',
        padding: '0 20px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '2px solid #2B7A8B'
      }}>
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg viewBox="0 0 80 108" xmlns="http://www.w3.org/2000/svg"
               style={{width:'28px',height:'38px',flexShrink:0}}>
            <path d="M40,6 C39.4,28 40.6,62 40,102" stroke="#F4EFE6" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <path d="M40,24 C36.5,23 31,21 25,18.5" stroke="#F4EFE6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M40,24 C43.5,23 49,21 55,18.5" stroke="#F4EFE6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M40,52 C44.5,51 51,53 57.5,56.5" stroke="#F4EFE6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M40,76 C36,77 30,80 23.5,83" stroke="#F4EFE6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M40,76 C44,77 50,80 56.5,83" stroke="#F4EFE6" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <circle cx="40" cy="24" r="3" fill="#F4EFE6"/>
            <circle cx="40" cy="52" r="3" fill="#F4EFE6"/>
            <circle cx="40" cy="76" r="3" fill="#F4EFE6"/>
          </svg>
          <div>
            <div style={{fontSize:'20px',letterSpacing:'0.12em',color:'#F4EFE6'}}>IEN</div>
            <div style={{fontSize:'9px',color:'rgba(244,239,230,0.4)',
                        letterSpacing:'0.14em',textTransform:'uppercase',
                        fontFamily:'Georgia,serif'}}>
              neurobienestar.institute
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '60px 20px',
        textAlign: 'center'
      }}>

        {/* Check icon */}
        <div style={{
          width: '72px',
          height: '72px',
          background: '#EAF3DE',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: '2px solid #639922'
        }}>
          <svg viewBox="0 0 24 24" style={{width:'32px',height:'32px'}}>
            <path d="M5 13l4 4L19 7" stroke="#27500A" strokeWidth="2.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '32px',
          fontWeight: '400',
          color: '#1C3D50',
          lineHeight: '1.2',
          margin: '0 0 20px'
        }}>
          Tu Protocolo está en camino.
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '17px',
          color: '#1A2326',
          lineHeight: '1.8',
          margin: '0 0 40px'
        }}>
          En los próximos minutos recibirás un email con el enlace
          de descarga del Protocolo Nervio Vago. Revisa también
          tu carpeta de spam si no lo ves en 5 minutos.
        </p>

        <div style={{
          borderTop: '1px solid rgba(28,61,80,0.1)',
          borderBottom: '1px solid rgba(28,61,80,0.1)',
          padding: '32px 0',
          margin: '0 0 40px'
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontWeight: '400',
            color: '#1C3D50',
            margin: '0 0 16px'
          }}>
            Mientras esperas — tu primera micro-activación
          </h2>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#5F5E5A',
            lineHeight: '1.85',
            margin: '0',
            textAlign: 'left'
          }}>
            Inspira por la nariz contando 4 tiempos.<br/>
            Espira por la boca contando 8 tiempos, como si soplases
            sobre una vela sin apagarla.<br/>
            Repite 5 veces.<br/><br/>
            <strong style={{color:'#1C3D50'}}>
              Esto es la Técnica 1 del Protocolo — la Espiración Larga.
              Ya estás activando tu nervio vago.
            </strong>
          </p>
        </div>

        {/* Upsell 21 días */}
        <div style={{
          background: 'rgba(43,122,139,0.08)',
          border: '1px solid rgba(43,122,139,0.2)',
          borderLeft: '3px solid #2B7A8B',
          borderRadius: '0 8px 8px 0',
          padding: '24px',
          textAlign: 'left'
        }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1C3D50',
            margin: '0 0 8px'
          }}>
            ¿Quieres resultados permanentes en 21 días?
          </p>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '13px',
            color: '#5F5E5A',
            lineHeight: '1.7',
            margin: '0 0 16px'
          }}>
            El Programa de Activación estructura las 7 técnicas en una
            práctica progresiva diaria que recalibra el tono vagal basal
            de forma permanente. Basado en neuroplasticidad de Hebb.
          </p>
          <a href="#" style={{
            color: '#2B7A8B',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: '500',
            fontFamily: 'Georgia, serif'
          }}>
            Ver el Programa de 21 días → 97€
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        background: '#1C3D50',
        padding: '24px 20px',
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <p style={{
          color: 'rgba(244,239,230,0.4)',
          fontSize: '11px',
          margin: '0',
          lineHeight: '1.6',
          fontFamily: 'Georgia, serif'
        }}>
          © 2025 Instituto Español de Neurobienestar · Método MAV<br/>
          neurobienestar.institute
        </p>
      </footer>

    </div>
  )
}
