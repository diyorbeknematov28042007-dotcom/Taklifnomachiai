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

// ========== SVG SHAPES ==========
const HeartShape = ({size=40, color='#d4a574'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} opacity=".85"/>
  </svg>
);

const RingsShape = ({size=48, color='#d4a574'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{display:'block',margin:'0 auto'}}>
    <circle cx="18" cy="24" r="10" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="30" cy="24" r="10" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="18" cy="24" r="6" stroke={color} strokeWidth="0.5" fill="none" opacity=".3"/>
    <circle cx="30" cy="24" r="6" stroke={color} strokeWidth="0.5" fill="none" opacity=".3"/>
    <path d="M24 16.5a10 10 0 010 15" stroke={color} strokeWidth="0.5" opacity=".2"/>
  </svg>
);

const LocationShape = ({size=40, color='#996b3d'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftShape = ({size=40, color='#996b3d'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".08"/>
    <path d="M12 8v13" stroke={color} strokeWidth="1.5"/>
    <rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".15"/>
    <path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".1"/>
    <path d="M12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".1"/>
  </svg>
);

const StarDivider = ({color='#d4a574'}) => (
  <svg width="120" height="20" viewBox="0 0 120 20" fill="none" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="10" x2="45" y2="10" stroke={color} strokeWidth="0.5" opacity=".4"/>
    <polygon points="60,2 63,8 70,9 65,14 66,21 60,17 54,21 55,14 50,9 57,8" fill={color} opacity=".6" transform="scale(0.6) translate(40,2)"/>
    <line x1="75" y1="10" x2="120" y2="10" stroke={color} strokeWidth="0.5" opacity=".4"/>
  </svg>
);

const ScrollArrow = ({color='#d4a574'}) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M7 10l5 5 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 6l5 5 5-5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity=".3"/>
  </svg>
);

const OrnamentTop = ({color='#d4a574'}) => (
  <svg width="160" height="40" viewBox="0 0 160 40" fill="none" style={{display:'block',margin:'0 auto 16px'}}>
    <path d="M80 38 C60 38 20 30 10 20 C5 15 5 5 15 5 C25 5 35 15 50 20 C65 25 75 15 80 10 C85 15 95 25 110 20 C125 15 135 5 145 5 C155 5 155 15 150 20 C140 30 100 38 80 38Z" stroke={color} strokeWidth="0.8" fill="none" opacity=".4"/>
    <circle cx="80" cy="5" r="2" fill={color} opacity=".5"/>
    <circle cx="40" cy="18" r="1.5" fill={color} opacity=".3"/>
    <circle cx="120" cy="18" r="1.5" fill={color} opacity=".3"/>
  </svg>
);

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
        @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px',
        background: 'linear-gradient(180deg, rgba(42,31,22,0.3) 0%, rgba(42,31,22,0.6) 50%, rgba(42,31,22,0.85) 100%), url(\'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80\') center/cover',
        color: T.textLight,
      }}>
        {/* Dekorativ doiralar */}
        <div style={{ position:'absolute', top:'8%', left:'-5%', width:200, height:200, borderRadius:'50%', border:`1px solid rgba(212,165,116,0.08)` }}/>
        <div style={{ position:'absolute', bottom:'12%', right:'-8%', width:280, height:280, borderRadius:'50%', border:`1px solid rgba(212,165,116,0.06)` }}/>
        <div style={{ position:'absolute', top:'20%', right:'10%', width:60, height:60, borderRadius:'50%', border:`1px solid rgba(212,165,116,0.05)` }}/>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(transparent,${T.bgColor})` }} />
        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1.2s ease', position:'relative', zIndex:1 }}>
          <div style={{ animation:'floatSlow 4s ease-in-out infinite', marginBottom:16 }}>
            <RingsShape size={52} color={T.accentLight} />
          </div>
          <div style={{ fontSize:11, letterSpacing:6, textTransform:'uppercase', opacity:.6, marginBottom:16 }}>To'y taklifi</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.3)', lineHeight: 1.15 }}>
            {(d.groomName || 'KUYOV').toUpperCase()}
          </div>
          <div style={{ margin:'10px 0' }}>
            <StarDivider color={T.accentLight}/>
          </div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 700, letterSpacing: 3, textShadow: '0 2px 20px rgba(0,0,0,0.3)', lineHeight: 1.15 }}>
            {(d.brideName || 'KELIN').toUpperCase()}
          </div>
          <div style={{ width:40, height:1, background:T.accentLight, margin:'20px auto 14px', opacity:.4 }}/>
          <div style={{ fontSize: 16, fontStyle: 'italic', opacity: .7, letterSpacing: 1 }}>Baxt to'yimizga taklif etamiz</div>
          <Countdown date={d.date || '2026-06-15'} style={{ marginTop: 28, position: 'relative', zIndex: 1 }}
            itemStyle={{ background:'rgba(212,165,116,0.15)', borderColor:'rgba(212,165,116,0.3)' }}
            numStyle={{ color:T.accentLight }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <ScrollArrow color={T.accentLight}/>
        </div>
      </div>

      {/* LOVE LETTER */}
      <Reveal style={{ padding: '56px 24px', textAlign: 'center', background: T.bgColor }}>
        <OrnamentTop color={T.accentLight}/>
        <div style={{ marginBottom:16 }}>
          <HeartShape size={36} color={T.accentLight}/>
        </div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 600, color: T.textDark, marginBottom: 16 }}>Sizni kutib qolamiz</h2>
        <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.75, color: T.textMuted, maxWidth: 340, margin: '0 auto' }}>
          {d.mainText || '"Aziz mehmonlarimiz, hayotimizdagi eng muhim kunni siz bilan birga nishonlashdan baxtiyor bo\'lamiz. Sizning tashrifingiz biz uchun katta sovg\'adir."'}
        </p>
      </Reveal>

      {/* DIVIDER */}
      <div style={{ padding:'0 20px', background:T.bgColor }}>
        <StarDivider color={T.accentLight}/>
      </div>

      {/* CALENDAR */}
      <Reveal style={{ padding: '50px 20px', background: T.bgColor }}>
        <Calendar date={d.date || '2026-06-15'} time={d.time || '18:00'} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ marginBottom:10, opacity: locSeen ? 1 : 0, transform: locSeen ? 'scale(1)' : 'scale(0.5)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>
            <LocationShape size={44} color={T.accent}/>
          </div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 20, opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .15s' }}>To'yxona manzili</h2>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(30px)', transition: 'all .8s ease .25s' }}>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* GIFT CARD */}
      {d.cardNumber && (
        <div ref={giftRef} style={{ padding: '50px 20px', textAlign: 'center', background: T.bgColor }}>
          <div style={{ marginBottom:10, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'scale(1)' : 'scale(0.3)', transition: 'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>
            <GiftShape size={44} color={T.accent}/>
          </div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 12, opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .1s' }}>To'yona va tabriklar</h2>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px', opacity: giftSeen ? 1 : 0, transition: 'all .6s ease .25s' }}>
            Sizning tilaklaringiz va to'yonangiz biz uchun qadrli.
          </p>
          <div style={{ opacity: giftSeen ? 1 : 0, transform: giftSeen ? 'translateY(0)' : 'translateY(20px)', transition: 'all .8s ease .4s' }}>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} accentFrom={T.accentLight} accentTo={T.accentDark} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: `linear-gradient(180deg,${T.bgColor},#f0e8dc)` }}>
        <OrnamentTop color={T.accentLight}/>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Javobingiz</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* FOOTER */}
      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#f0e8dc' }}>
        <HeartShape size={20} color={T.accentLight}/>
        <div style={{ fontSize: 13, color: '#8a7d6f', marginTop:8 }}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
