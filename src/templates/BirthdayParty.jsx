import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, MapButtons, RsvpForm, sharedKeyframes } from './TemplateShared';

export default function BirthdayParty({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const person = d.birthdayPerson || 'Ism';
  const bdDate = d.birthdayDate || '2026-06-15';
  const F = "'Playfair Display',serif";
  const B = "'Cormorant Garamond',serif";
  const accent = '#ff6b35';

  useEffect(() => { setTimeout(() => setHero(true), 300); }, []);

  // Confetti particles
  const confetti = [...Array(14)].map((_, i) => ({
    left: (i * 7.5 + Math.random() * 5) + '%',
    bg: ['#ff6b35','#ffd93d','#6bcb77','#4d96ff','#ff6b9d','#c084fc'][i % 6],
    dur: 3 + Math.random() * 4,
    delay: Math.random() * 3,
    size: 6 + Math.random() * 6,
    rot: Math.random() > 0.5 ? 1 : -1,
  }));

  return (
    <div style={{ fontFamily: B, color: '#2d2d2d', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes confFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}80%{opacity:.7}100%{transform:translateY(100vh) rotate(var(--rot));opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pop{0%{transform:scale(0) rotate(-15deg);opacity:0}70%{transform:scale(1.1) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px',
        background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 40%, #e84393 100%)',
        color: '#fff', overflow: 'hidden',
      }}>
        {confetti.map((c, i) => (
          <div key={i} style={{
            position: 'absolute', top: -20, left: c.left, width: c.size, height: c.size,
            borderRadius: i % 3 === 0 ? '50%' : '2px', background: c.bg, opacity: .7,
            animation: `confFall ${c.dur}s linear ${c.delay}s infinite`,
            '--rot': c.rot > 0 ? '720deg' : '-540deg',
          }} />
        ))}

        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>🎂</div>
          <div style={{ fontSize: 12, letterSpacing: 5, textTransform: 'uppercase', opacity: .8, marginBottom: 12 }}>Tug'ilgan kun</div>
          <div style={{ fontFamily: F, fontSize: 38, fontWeight: 700, textShadow: '0 2px 20px rgba(0,0,0,0.2)', lineHeight: 1.15 }}>
            {person.toUpperCase()}
          </div>
          <div style={{ fontSize: 17, fontStyle: 'italic', marginTop: 14, opacity: .85 }}>bayramiga taklif etamiz!</div>
          <Countdown date={bdDate} style={{ marginTop: 28 }}
            itemStyle={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* MESSAGE */}
      <Reveal style={{ padding: '56px 24px', textAlign: 'center', background: '#fff8f0' }}>
        <div style={{ fontSize: 32, marginBottom: 14, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🎉</div>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>Bayramga marhamat!</h2>
        <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.75, color: '#666', maxWidth: 340, margin: '0 auto' }}>
          {d.birthdayText || `"Hayotning yana bir go'zal yili boshlanyapti! Shu quvonchli kunni birga nishonlashni istaymiz. Kelishingiz — eng katta sovg'a!"`}
        </p>
      </Reveal>

      {/* DATE & TIME */}
      <Reveal style={{ padding: '40px 24px', textAlign: 'center', background: '#fff8f0' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 340, margin: '0 auto', boxShadow: '0 4px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📅</div>
          <div style={{ fontFamily: F, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Qachon?</div>
          <div style={{ fontSize: 18, color: accent, fontWeight: 600 }}>{bdDate}</div>
        </div>
      </Reveal>

      {/* LOCATION */}
      {d.birthdayAddress && (
        <div ref={locRef} style={{ padding: '40px 20px', textAlign: 'center', background: '#fff8f0' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: locSeen ? 1 : 0, transform: locSeen ? 'scale(1)' : 'scale(0.5)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>📍</div>
          <h2 style={{ fontFamily: F, fontSize: 24, fontWeight: 600, marginBottom: 16, opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .15s' }}>Qayerda?</h2>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(30px)', transition: 'all .8s ease .25s' }}>
            <MapButtons address={d.birthdayAddress} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #fff8f0, #ffe8d6)' }}>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 20 }}>Kelasizmi? 🤗</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={accent} textColor="#2d2d2d" />
      </Reveal>

      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#ffe8d6', fontSize: 13, color: '#c4956a' }}>
        © {new Date().getFullYear()} {person} tug'ilgan kuni 🎂
      </div>
    </div>
  );
}
