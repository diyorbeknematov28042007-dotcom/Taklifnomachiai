import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, RsvpForm, sharedKeyframes } from './TemplateShared';

export default function LoveRomantic({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const from = d.loveFrom || 'Sen';
  const to = d.loveTo || 'Men';
  const text = d.loveText || '';
  const F = "'Playfair Display',serif";
  const B = "'Cormorant Garamond',serif";
  const accent = '#e74c6f';

  useEffect(() => { setTimeout(() => setHero(true), 500); }, []);

  // Floating hearts
  const hearts = [...Array(10)].map((_, i) => ({
    left: Math.random() * 100 + '%',
    size: 12 + Math.random() * 16,
    dur: 4 + Math.random() * 6,
    delay: Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.2,
  }));

  return (
    <div style={{ fontFamily: B, color: '#3a2a2a', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes heartFloat{0%{transform:translateY(100vh) scale(0.5);opacity:0}10%{opacity:var(--op)}90%{opacity:var(--op)}100%{transform:translateY(-20px) scale(1);opacity:0}}
        @keyframes heartBeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}45%{transform:scale(1.15)}60%{transform:scale(1)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(231,76,111,0.3)}50%{text-shadow:0 0 40px rgba(231,76,111,0.6)}}
        @keyframes typewriter{from{max-height:0;opacity:0}to{max-height:500px;opacity:1}}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px',
        background: 'linear-gradient(180deg, #1a0a10 0%, #2d1520 40%, #1a0a10 100%)',
        color: '#f5e6ec', overflow: 'hidden',
      }}>
        {/* Floating hearts bg */}
        {hearts.map((h, i) => (
          <div key={i} style={{
            position: 'absolute', left: h.left, bottom: -20, fontSize: h.size,
            animation: `heartFloat ${h.dur}s linear ${h.delay}s infinite`,
            '--op': h.opacity, pointerEvents: 'none',
          }}>❤</div>
        ))}

        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.5s ease', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', opacity: .5, marginBottom: 20 }}>Dil izhori</div>
          <div style={{ fontFamily: F, fontSize: 20, fontWeight: 400, opacity: .7, fontStyle: 'italic' }}>{from}</div>
          <div style={{ fontSize: 64, margin: '16px 0', animation: 'heartBeat 1.5s ease-in-out infinite', display: 'inline-block' }}>❤️</div>
          <div style={{ fontFamily: F, fontSize: 20, fontWeight: 400, opacity: .7, fontStyle: 'italic' }}>{to}</div>
          <div style={{ width: 40, height: 1, background: accent, margin: '24px auto', opacity: .5 }} />
          <div style={{ fontSize: 14, opacity: .5, fontStyle: 'italic' }}>pastga suring...</div>
        </div>
      </div>

      {/* LOVE LETTER */}
      <Reveal style={{ padding: '70px 28px', textAlign: 'center', background: 'linear-gradient(180deg, #1a0a10, #2a1018)' }}>
        <div style={{ fontFamily: F, fontSize: 24, fontWeight: 600, color: accent, marginBottom: 24, animation: 'glow 3s ease-in-out infinite' }}>
          Senga...
        </div>
        <div style={{
          fontFamily: F, fontSize: 17, fontStyle: 'italic', lineHeight: 2, color: '#c4a0aa',
          maxWidth: 340, margin: '0 auto', textAlign: 'left', whiteSpace: 'pre-wrap',
        }}>
          {text || `Seni birinchi ko'rganimda, dunyoda eng go'zal narsani ko'rgandek his qildim.\n\nHar bir kunim sen bilan boshlanishi va tugashini istayman.\n\nSen mening hayotimga kirganingda, hammasi o'zgardi. Sen — mening baxtim, mening kuchim, mening dunyoim.\n\nSeni sevaman. Doimo.`}
        </div>
      </Reveal>

      {/* FROM */}
      <Reveal delay={0.2} style={{ padding: '40px 24px', textAlign: 'center', background: '#2a1018' }}>
        <div style={{ width: 50, height: 1, background: accent, margin: '0 auto 20px', opacity: .3 }} />
        <div style={{ fontFamily: F, fontSize: 16, fontStyle: 'italic', color: '#8a6070' }}>Chin yurakdan,</div>
        <div style={{ fontFamily: F, fontSize: 22, fontWeight: 600, color: accent, marginTop: 8 }}>{from}</div>
        <div style={{ width: 50, height: 1, background: accent, margin: '20px auto 0', opacity: .3 }} />
      </Reveal>

      {/* RESPONSE */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #2a1018, #1a0a10)' }}>
        <h2 style={{ fontFamily: F, fontSize: 24, fontWeight: 600, color: accent, marginBottom: 20 }}>Javobingiz...</h2>
        <RsvpForm onRespond={onRespond} sent={sent} showRsvp={false} accentColor={accent} textColor="#c4a0aa" />
      </Reveal>

      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#0f0510', fontSize: 13, color: '#4a2535' }}>
        ❤ {from} → {to}
      </div>
    </div>
  );
}
