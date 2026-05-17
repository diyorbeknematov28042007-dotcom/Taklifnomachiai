import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

// THEME — bu o'zgaruvchilarni o'zgartirsangiz, butun shablon rangi o'zgaradi
const THEME = {
  heroImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  heroOverlay: 'linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45))',
  bgColor: '#fdfbf7',
  accent: '#d4a574',
  accentDark: '#b8863a',
  textDark: '#5c4a3a',
  textLight: '#fff',
  fontDisplay: "'Playfair Display',serif",
  fontBody: "'Cormorant Garamond',serif",
};

export default function WeddingClassic({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const T = THEME;
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 400); }, []);

  return (
    <div style={{ fontFamily: T.fontBody, color: T.textDark, overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px',
        background: `${T.heroOverlay},url('${T.heroImg}') center/cover`, color: T.textLight,
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(transparent,${T.bgColor})` }} />
        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.2s ease' }}>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.5)', lineHeight: 1.15 }}>
            {(d.groomName || 'KUYOV').toUpperCase()}
          </div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 30, color: T.accent, fontStyle: 'italic', margin: '2px 0' }}>&</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.5)', lineHeight: 1.15 }}>
            {(d.brideName || 'KELIN').toUpperCase()}
          </div>
          <div style={{ fontSize: 17, fontStyle: 'italic', marginTop: 12, opacity: .85, letterSpacing: 1 }}>Baxt to'yimizga taklif etamiz</div>
          <Countdown date={d.date || '2026-06-15'} style={{ marginTop: 28, position: 'relative', zIndex: 1 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* LOVE LETTER */}
      <Reveal className="" style={{ padding: '56px 24px', textAlign: 'center', background: T.bgColor }}>
        <div style={{ fontSize: 32, marginBottom: 14, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🤍</div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, color: '#2c2c2c', marginBottom: 16 }}>Qalblarimiz birlashgan kunda...</h2>
        <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.75, color: '#5a5a5a', maxWidth: 340, margin: '0 auto' }}>
          {d.mainText || `"Aziz mehmonlarimiz, hayotimizdagi eng muhim kunni siz bilan birga nishonlashdan baxtiyor bo'lamiz. Sizning tashrifingiz biz uchun katta sovg'adir."`}
        </p>
      </Reveal>

      {/* CALENDAR */}
      <Reveal style={{ padding: '50px 20px', background: T.bgColor }}>
        <Calendar date={d.date || '2026-06-15'} time={d.time || '18:00'} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ fontSize: 36, color: T.accent, marginBottom: 10, opacity: locSeen ? 1 : 0, transform: locSeen ? 'scale(1)' : 'scale(0.5)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>📍</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, marginBottom: 20, opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .15s' }}>To'yxona manzili</h2>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.92)', transition: 'all .8s ease .25s' }}>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* GIFT CARD */}
      {d.cardNumber && (
        <div ref={giftRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'scale(1) rotate(0)' : 'scale(0.3) rotate(-30deg)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>🎁</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, marginBottom: 12, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .1s' }}>To'yona va tabriklar</h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px', opacity: giftSeen ? 1 : 0, transition: 'all .6s ease .25s' }}>
            Sizning tilaklaringiz va to'yonangiz biz uchun qadrli. Quyidagi kartadan foydalanishingiz mumkin:
          </p>
          <div style={{ opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'perspective(800px) rotateY(0) scale(1)' : 'perspective(800px) rotateY(30deg) scale(0.88)', transition: 'all 1s ease .4s' }}>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} accentFrom={T.accent} accentTo={T.accentDark} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: `linear-gradient(180deg,${T.bgColor},#f5efe6)` }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, marginBottom: 20 }}>Javobingiz</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* FOOTER */}
      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#f5efe6', fontSize: 13, color: '#aaa' }}>
        © {new Date().getFullYear()} {d.groomName} & {d.brideName}
      </div>
    </div>
  );
}
