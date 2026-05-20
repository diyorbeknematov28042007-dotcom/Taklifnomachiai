import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

const THEME = {
  bgColor: '#fdfbf7',
  accent: '#996b3d',
  accentLight: '#d4a574',
  accentDark: '#7a5428',
  textDark: '#3a2e24',
  textMuted: '#6b5d50',
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

      {/* HERO — gradient fon (tashqi rasmga bog'liq emas) */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px',
        background: 'linear-gradient(180deg, #5c4a3a 0%, #3a2e24 40%, #2a1f16 100%)',
        color: T.textLight,
      }}>
        {/* Dekorativ doiralar */}
        <div style={{ position:'absolute', top:'10%', left:'-5%', width:200, height:200, borderRadius:'50%', border:`1px solid rgba(212,165,116,0.1)` }}/>
        <div style={{ position:'absolute', bottom:'15%', right:'-8%', width:280, height:280, borderRadius:'50%', border:`1px solid rgba(212,165,116,0.08)` }}/>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(transparent,${T.bgColor})` }} />
        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.2s ease', position:'relative', zIndex:1 }}>
          <div style={{ width:40, height:1, background:T.accentLight, margin:'0 auto 20px', opacity:.5 }}/>
          <div style={{ fontSize:11, letterSpacing:6, textTransform:'uppercase', opacity:.6, marginBottom:16 }}>To'y taklifi</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.3)', lineHeight: 1.15 }}>
            {(d.groomName || 'KUYOV').toUpperCase()}
          </div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.accentLight, margin: '8px 0', letterSpacing:3 }}>✦</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.3)', lineHeight: 1.15 }}>
            {(d.brideName || 'KELIN').toUpperCase()}
          </div>
          <div style={{ width:40, height:1, background:T.accentLight, margin:'20px auto 14px', opacity:.5 }}/>
          <div style={{ fontSize: 16, fontStyle: 'italic', opacity: .7, letterSpacing: 1 }}>Baxt to'yimizga taklif etamiz</div>
          <Countdown date={d.date || '2026-06-15'} style={{ marginTop: 28, position: 'relative', zIndex: 1 }}
            itemStyle={{ background:'rgba(212,165,116,0.15)', borderColor:'rgba(212,165,116,0.3)' }}
            numStyle={{ color:T.accentLight }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.accentLight} strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ padding:'0 40px', background:T.bgColor }}>
        <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.accentLight}40, transparent)` }}/>
      </div>

      {/* LOVE LETTER */}
      <Reveal style={{ padding: '56px 24px', textAlign: 'center', background: T.bgColor }}>
        <div style={{ width:30, height:30, margin:'0 auto 16px', borderRadius:'50%', background:`${T.accentLight}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>♡</div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, color: T.textDark, marginBottom: 16 }}>Sizni kutib qolamiz</h2>
        <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.75, color: T.textMuted, maxWidth: 340, margin: '0 auto' }}>
          {d.mainText || '"Aziz mehmonlarimiz, hayotimizdagi eng muhim kunni siz bilan birga nishonlashdan baxtiyor bo\'lamiz. Sizning tashrifingiz biz uchun katta sovg\'adir."'}
        </p>
      </Reveal>

      {/* DIVIDER */}
      <div style={{ padding:'0 40px', background:T.bgColor }}>
        <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.accentLight}40, transparent)` }}/>
      </div>

      {/* CALENDAR */}
      <Reveal style={{ padding: '50px 20px', background: T.bgColor }}>
        <Calendar date={d.date || '2026-06-15'} time={d.time || '18:00'} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ fontSize: 36, color: T.accent, marginBottom: 10, opacity: locSeen ? 1 : 0, transform: locSeen ? 'scale(1)' : 'scale(0.5)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>📍</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 20, opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .15s' }}>To'yxona manzili</h2>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(30px)', transition: 'all .8s ease .25s' }}>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* GIFT CARD */}
      {d.cardNumber && (
        <div ref={giftRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'scale(1)' : 'scale(0.3)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>🎁</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 12, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .1s' }}>To'yona va tabriklar</h2>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px', opacity: giftSeen ? 1 : 0, transition: 'all .6s ease .25s' }}>
            Sizning tilaklaringiz va to'yonangiz biz uchun qadrli. Quyidagi kartadan foydalanishingiz mumkin:
          </p>
          <div style={{ opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .8s ease .4s' }}>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} accentFrom={T.accentLight} accentTo={T.accentDark} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: `linear-gradient(180deg,${T.bgColor},#f0e8dc)` }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Javobingiz</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* FOOTER */}
      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#f0e8dc', fontSize: 13, color: '#8a7d6f' }}>
        © {new Date().getFullYear()} {d.groomName} & {d.brideName}
      </div>
    </div>
  );
}
