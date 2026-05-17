import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, MapButtons, RsvpForm, sharedKeyframes } from './TemplateShared';

export default function BirthdayKids({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const person = d.birthdayPerson || 'Ism';
  const bdDate = d.birthdayDate || '2026-06-15';
  const F = "'Playfair Display',serif";
  const B = "'Cormorant Garamond',serif";
  const accent = '#e84393';

  useEffect(() => { setTimeout(() => setHero(true), 300); }, []);

  const balloons = ['🎈','🎈','🎈','🎈','🎈','🎈'];
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#e84393','#c084fc'];

  return (
    <div style={{ fontFamily: B, color: '#2d2d2d', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes floatBalloon{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-20px) rotate(3deg)}}
        @keyframes starSpin{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px',
        background: 'linear-gradient(180deg, #ffeef8 0%, #fff0f6 30%, #fce4ec 100%)',
        color: '#2d2d2d', overflow: 'hidden',
      }}>
        {/* Floating balloons */}
        {balloons.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', fontSize: 32,
            left: (10 + i * 15) + '%', top: (15 + (i % 3) * 20) + '%',
            animation: `floatBalloon ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
            opacity: 0.5, filter: `hue-rotate(${i * 50}deg)`,
          }}>{b}</div>
        ))}

        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)', transition: 'all 1s ease', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🎁</div>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 12 }}>Tug'ilgan kun bayramiga</div>
          <div style={{ fontFamily: F, fontSize: 36, fontWeight: 700, color: '#2d2d2d', lineHeight: 1.15 }}>
            {person}
          </div>
          <div style={{ fontSize: 16, fontStyle: 'italic', marginTop: 10, color: '#888' }}>taklif etamiz! 🌟</div>
          <Countdown date={bdDate} style={{ marginTop: 28 }}
            itemStyle={{ background: 'rgba(232,67,147,0.1)', borderColor: 'rgba(232,67,147,0.25)', color: '#2d2d2d' }}
            numStyle={{ color: accent }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={accent} strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* MESSAGE */}
      <Reveal style={{ padding: '56px 24px', textAlign: 'center', background: '#fff' }}>
        <div style={{ fontSize: 32, marginBottom: 14, display: 'inline-block', animation: 'starSpin 4s linear infinite' }}>⭐</div>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 16, color: accent }}>Keling, birga bayram qilamiz!</h2>
        <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.75, color: '#666', maxWidth: 340, margin: '0 auto' }}>
          {d.birthdayText || `"Yilning eng kutilgan kuni keldi! O'yinlar, tortlar va ko'p-ko'p kulgu kutmoqda. Keling, birga shodlanamiz!"`}
        </p>
      </Reveal>

      {/* DATE */}
      <Reveal style={{ padding: '40px 24px', textAlign: 'center', background: '#fff' }}>
        <div style={{ background: 'linear-gradient(135deg, #ffeef8, #fff0f6)', borderRadius: 20, padding: 28, maxWidth: 340, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🗓</div>
          <div style={{ fontFamily: F, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Qachon?</div>
          <div style={{ fontSize: 18, color: accent, fontWeight: 600 }}>{bdDate}</div>
        </div>
      </Reveal>

      {/* LOCATION */}
      {d.birthdayAddress && (
        <div ref={locRef} style={{ padding: '40px 20px', textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: locSeen ? 1 : 0, transform: locSeen ? 'scale(1)' : 'scale(0.5)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>🏠</div>
          <h2 style={{ fontFamily: F, fontSize: 24, fontWeight: 600, marginBottom: 16, opacity: locSeen ? 1 : 0, transition: 'all .6s ease .15s' }}>Qayerga kelish kerak?</h2>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(30px)', transition: 'all .8s ease .25s' }}>
            <MapButtons address={d.birthdayAddress} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #fff, #ffeef8)' }}>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 20, color: accent }}>Kelasizmi? 🎉</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={accent} textColor="#2d2d2d" />
      </Reveal>

      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#ffeef8', fontSize: 13, color: '#d4849b' }}>
        © {new Date().getFullYear()} {person} tug'ilgan kuni 🎂✨
      </div>
    </div>
  );
}
