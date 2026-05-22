import { useState, useEffect } from 'react';
import { Reveal, RsvpForm, sharedKeyframes } from './TemplateShared';

export default function LoveRomantic({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const from = d.loveFrom || 'Men';
  const to = d.loveTo || 'Sen';
  const text = d.loveText || '';
  const F = "'Playfair Display',serif";
  const B = "'Cormorant Garamond',serif";

  const [stage, setStage] = useState(0);
  // 0 = konvert yopiq, 1 = konvert ochilmoqda, 2 = xat chiqmoqda, 3 = to'liq ochildi

  const nextStage = () => {
    if (stage < 3) setStage(s => s + 1);
  };

  useEffect(() => {
    // Avtomatik boshlash — 1 soniyadan keyin
    const t = setTimeout(() => { if (stage === 0) setStage(1); }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Xat matnini qismlarga bo'lish
  const fullText = text || `Seni birinchi ko'rganimda, dunyoda eng go'zal narsani ko'rgandek his qildim.

Har bir kunim sen bilan boshlanishi va tugashini istayman.

Sen mening hayotimga kirganingda, hammasi o'zgardi. Sen — mening baxtim, mening kuchim, mening dunyoim.

Seni sevaman. Doimo.`;

  const lines = fullText.split('\n').filter(l => l.trim());

  return (
    <div onClick={nextStage} style={{
      fontFamily: B, color: '#4a2030', overflowX: 'hidden', minHeight: '100vh',
      background: 'linear-gradient(180deg, #2a0a15 0%, #1a0510 100%)',
      cursor: stage < 3 ? 'pointer' : 'default',
      userSelect: 'none', WebkitTapHighlightColor: 'transparent',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes envelopeShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-1deg)}75%{transform:rotate(1deg)}}
        @keyframes flapOpen{0%{transform:rotateX(0)}100%{transform:rotateX(180deg)}}
        @keyframes letterRise{0%{transform:translateY(0)}100%{transform:translateY(-120px)}}
        @keyframes letterFadeIn{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes heartFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.1)}}
        @keyframes sparkle{0%,100%{opacity:.1;transform:scale(.8)}50%{opacity:.6;transform:scale(1.2)}}
        @keyframes sealBreak{0%{transform:scale(1);opacity:1}100%{transform:scale(1.5);opacity:0}}
        @keyframes unfold{0%{max-height:0;opacity:0}100%{max-height:1000px;opacity:1}}
      `}</style>

      {/* ============ KONVERT SAHIFASI ============ */}
      {stage < 3 && (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
          position: 'relative',
        }}>
          {/* Fon yulduzchalar */}
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', width: 3 + (i%3)*2, height: 3 + (i%3)*2, borderRadius: '50%',
              background: '#e74c6f', left: `${8 + i*7.5}%`, top: `${5 + (i%4)*22}%`,
              animation: `sparkle ${3 + i*0.5}s ease ${i*0.3}s infinite`, pointerEvents: 'none',
            }}/>
          ))}

          {/* "Kimga" yozuvi */}
          <div style={{
            fontFamily: F, fontSize: 14, letterSpacing: 4, textTransform: 'uppercase',
            color: '#e74c6f', opacity: .6, marginBottom: 20,
          }}>
            {stage === 0 ? 'Maxsus xat' : stage === 1 ? 'Ochilmoqda...' : 'Xatingiz...'}
          </div>

          {/* KONVERT */}
          <div style={{
            position: 'relative', width: 280, height: 200,
            animation: stage === 0 ? 'envelopeShake 3s ease infinite' : 'none',
            transition: 'all 0.5s ease',
            transform: stage >= 2 ? 'scale(0.8) translateY(-30px)' : 'scale(1)',
            opacity: stage >= 2 ? 0.3 : 1,
          }}>
            {/* Konvert body */}
            <div style={{
              position: 'absolute', bottom: 0, width: '100%', height: 140,
              background: 'linear-gradient(135deg, #f5e6ec, #f0d8e0)',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 8px 40px rgba(231,76,111,0.2)',
            }}>
              {/* Konvert ichki chiziq */}
              <div style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, border: '1px solid rgba(231,76,111,0.1)', borderRadius: 4 }}/>
            </div>

            {/* Konvert qopqog'i (flap) */}
            <div style={{
              position: 'absolute', top: 0, width: '100%', height: 120,
              background: 'linear-gradient(180deg, #e8c8d0, #f0d8e0)',
              clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 100% 100%, 0 100%)',
              transformOrigin: 'top center',
              transform: stage >= 1 ? 'rotateX(180deg)' : 'rotateX(0)',
              transition: 'transform 1s ease',
              zIndex: stage >= 1 ? 0 : 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}/>

            {/* Muhr (seal) */}
            {stage === 0 && (
              <div style={{
                position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)',
                zIndex: 3,
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#e74c6f" opacity=".8"/>
                  <path d="M20 10 L22 16 L28 16 L23 20 L25 26 L20 22 L15 26 L17 20 L12 16 L18 16Z" fill="#fff" opacity=".9"/>
                </svg>
              </div>
            )}

            {/* Muhr sinishi */}
            {stage === 1 && (
              <div style={{
                position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)',
                zIndex: 3, animation: 'sealBreak 0.8s ease forwards',
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#e74c6f" opacity=".8"/>
                  <path d="M20 10 L22 16 L28 16 L23 20 L25 26 L20 22 L15 26 L17 20 L12 16 L18 16Z" fill="#fff" opacity=".9"/>
                </svg>
              </div>
            )}

            {/* "Kimga" yozuvi konvert ustida */}
            <div style={{
              position: 'absolute', bottom: 35, left: 0, right: 0, textAlign: 'center',
              fontFamily: F, fontSize: 20, fontWeight: 600, fontStyle: 'italic',
              color: '#8a4050',
              zIndex: 1,
            }}>
              {to} ga
            </div>

            {/* Xat ko'tarilmoqda */}
            {stage >= 1 && (
              <div style={{
                position: 'absolute', top: stage >= 2 ? -80 : 20, left: 20, right: 20,
                background: '#fffaf5', borderRadius: 8, padding: '16px 14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'top 1s ease 0.5s',
                zIndex: 1,
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: F, fontSize: 13, color: '#c4788a', fontStyle: 'italic' }}>
                  {from} dan...
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#e74c6f" style={{margin:'6px auto', display:'block'}}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Bosish tavsiyasi */}
          <div style={{
            marginTop: 30, fontSize: 13, color: 'rgba(231,76,111,0.4)',
            fontStyle: 'italic', animation: 'heartFloat 2s ease infinite',
          }}>
            {stage === 0 ? '💌 Bosib oching...' : stage === 1 ? '💌 Yana bosing...' : '💌 Xatni o\'qing...'}
          </div>
        </div>
      )}

      {/* ============ XAT TO'LIQ OCHILDI ============ */}
      {stage >= 3 && (
        <div>
          {/* Xat sarlavhasi */}
          <div style={{
            padding: '60px 28px 40px', textAlign: 'center',
            background: 'linear-gradient(180deg, #2a0a15, #1a0510)',
          }}>
            <div style={{
              fontFamily: F, fontSize: 13, letterSpacing: 4, textTransform: 'uppercase',
              color: '#e74c6f', opacity: .5, marginBottom: 16,
            }}>Sevgi xati</div>

            <div style={{
              fontFamily: F, fontSize: 16, color: '#c4788a', fontStyle: 'italic',
              marginBottom: 8,
            }}>{from}</div>

            <div style={{ animation: 'heartFloat 2s ease infinite', margin: '12px 0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#e74c6f">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            <div style={{
              fontFamily: F, fontSize: 16, color: '#c4788a', fontStyle: 'italic',
            }}>{to}</div>
          </div>

          {/* Xat matni — qog'oz ko'rinishda */}
          <div style={{
            background: '#fffaf5', margin: '0 16px', borderRadius: '20px 20px 0 0',
            padding: '40px 28px 50px', position: 'relative',
            boxShadow: '0 -4px 30px rgba(0,0,0,0.2)',
          }}>
            {/* Qog'oz chetlari */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(231,76,111,0.1), transparent)' }}/>

            {/* Xat chiziqchasi */}
            <div style={{ width: 40, height: 2, background: '#e74c6f', opacity: .3, margin: '0 auto 24px', borderRadius: 1 }}/>

            <div style={{
              fontFamily: F, fontSize: 20, fontWeight: 600, color: '#6a3040',
              textAlign: 'center', marginBottom: 24,
            }}>
              Aziz {to},
            </div>

            {/* Xat matni — har bir qator asta paydo bo'ladi */}
            {lines.map((line, i) => (
              <div key={i} style={{
                fontFamily: F, fontSize: 17, fontStyle: 'italic', lineHeight: 1.9,
                color: '#5a3040', textAlign: 'center', marginBottom: 20,
                animation: `letterFadeIn 0.8s ease ${i * 0.4}s both`,
                maxWidth: 320, margin: '0 auto 20px',
              }}>
                "{line.trim()}"
              </div>
            ))}

            {/* Imzo */}
            <div style={{
              marginTop: 40, textAlign: 'center',
              animation: `letterFadeIn 0.8s ease ${lines.length * 0.4}s both`,
            }}>
              <div style={{ width: 50, height: 1, background: '#e74c6f', opacity: .2, margin: '0 auto 16px' }}/>
              <div style={{ fontFamily: F, fontSize: 14, color: '#8a5060', fontStyle: 'italic' }}>Chin yurakdan,</div>
              <div style={{ fontFamily: F, fontSize: 22, fontWeight: 600, color: '#e74c6f', marginTop: 6 }}>{from}</div>
              <div style={{ marginTop: 12 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e74c6f" opacity=".5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Javob */}
          <div style={{
            background: '#fffaf5', margin: '0 16px', padding: '0 28px 40px',
            animation: `letterFadeIn 1s ease ${(lines.length + 1) * 0.4}s both`,
          }}>
            <div style={{ width: '100%', height: 1, background: 'rgba(231,76,111,0.1)', marginBottom: 30 }}/>
            <div style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: '#6a3040', textAlign: 'center', marginBottom: 16 }}>
              Javobingiz...
            </div>
            <RsvpForm onRespond={onRespond} sent={sent} showRsvp={false} accentColor="#e74c6f" textColor="#5a3040" />
          </div>

          {/* Footer */}
          <div style={{
            background: '#fffaf5', margin: '0 16px', borderRadius: '0 0 20px 20px',
            padding: '20px 28px 30px', textAlign: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c6f" opacity=".3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div style={{ fontSize: 12, color: '#b08090', marginTop: 6 }}>
              {from} → {to}
            </div>
          </div>

          <div style={{ height: 40, background: 'linear-gradient(180deg, #1a0510, #0f0308)' }}/>
        </div>
      )}
    </div>
  );
}
