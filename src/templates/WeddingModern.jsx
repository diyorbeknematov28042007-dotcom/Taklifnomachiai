import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

const T = {
  bg: '#f5f2eb',
  bgDark: '#1a2e1a',
  accent: '#1b6b3a',
  accentLight: '#2d8f52',
  gold: '#c9a84c',
  goldLight: '#dbc476',
  textDark: '#1a2418',
  textMuted: '#4a5d4a',
  textLight: '#f0ead6',
  font: "'Playfair Display',serif",
  body: "'Cormorant Garamond',serif",
};

// ========== ISLOMIY SVG SHAPES ==========

// Bismillah
const Bismillah = ({size=180, color='#c9a84c'}) => (
  <svg width={size} height={size*0.4} viewBox="0 0 200 80" fill="none" style={{display:'block',margin:'0 auto'}}>
    <text x="100" y="50" textAnchor="middle" fontFamily="'Times New Roman',serif" fontSize="36" fill={color} fontStyle="italic" opacity=".9">بِسْمِ اللَّهِ</text>
    <text x="100" y="72" textAnchor="middle" fontFamily="'Times New Roman',serif" fontSize="18" fill={color} opacity=".6">الرَّحْمٰنِ الرَّحِيمِ</text>
  </svg>
);

// Islomiy geometrik naqsh (8 burchakli yulduz)
const IslamicStar = ({size=60, color='#c9a84c', opacity=0.3}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{display:'block',margin:'0 auto'}}>
    <polygon points="50,5 61,35 95,35 68,55 79,85 50,68 21,85 32,55 5,35 39,35" stroke={color} strokeWidth="1" fill={color} fillOpacity={opacity*0.3}/>
    <polygon points="50,15 58,38 85,38 63,52 72,78 50,62 28,78 37,52 15,38 42,38" stroke={color} strokeWidth="0.5" fill="none" opacity={opacity}/>
    <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="0.5" fill="none" opacity={opacity*0.7}/>
  </svg>
);

// Hilol va yulduz
const CrescentStar = ({size=48, color='#c9a84c'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M20 6C11.16 6 4 13.16 4 22s7.16 16 16 16c3.7 0 7.1-1.26 9.8-3.38C27.22 37.36 23.76 39 20 39 11.72 39 5 32.28 5 24S11.72 9 20 9c.68 0 1.35.05 2 .14C21.36 6.84 20 6 20 6z" fill={color} opacity=".8"/>
    <polygon points="38,8 39.5,13 44,13 40.5,16 42,21 38,18 34,21 35.5,16 32,13 36.5,13" fill={color} opacity=".9"/>
  </svg>
);

// Islomiy arch (mehrab shakli)
const IslamicArch = ({width=280, height=40, color='#c9a84c'}) => (
  <svg width={width} height={height} viewBox="0 0 280 40" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M0 40 Q0 0 140 0 Q280 0 280 40" stroke={color} strokeWidth="1" fill="none" opacity=".3"/>
    <path d="M20 40 Q20 8 140 8 Q260 8 260 40" stroke={color} strokeWidth="0.5" fill="none" opacity=".2"/>
    <circle cx="140" cy="6" r="3" fill={color} opacity=".4"/>
    <circle cx="60" cy="22" r="1.5" fill={color} opacity=".2"/>
    <circle cx="220" cy="22" r="1.5" fill={color} opacity=".2"/>
  </svg>
);

// Islomiy divider
const IslamicDivider = ({color='#c9a84c'}) => (
  <svg width="200" height="24" viewBox="0 0 200 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="0.5" opacity=".3"/>
    <polygon points="100,2 106,12 100,22 94,12" stroke={color} strokeWidth="0.8" fill={color} fillOpacity=".15"/>
    <circle cx="100" cy="12" r="3" fill={color} opacity=".4"/>
    <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="0.5" opacity=".3"/>
  </svg>
);

// Masjid silueti
const MosqueSilhouette = ({size=60, color='#c9a84c'}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 100 70" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="20" y="35" width="60" height="35" fill={color} opacity=".1" rx="2"/>
    <path d="M30 35 Q30 15 50 10 Q70 15 70 35" fill={color} opacity=".15"/>
    <rect x="47" y="5" width="6" height="12" fill={color} opacity=".2" rx="3"/>
    <circle cx="50" cy="4" r="3" fill={color} opacity=".3"/>
    <rect x="12" y="25" width="6" height="45" fill={color} opacity=".1" rx="1"/>
    <circle cx="15" cy="22" r="4" fill={color} opacity=".15"/>
    <rect x="82" y="25" width="6" height="45" fill={color} opacity=".1" rx="1"/>
    <circle cx="85" cy="22" r="4" fill={color} opacity=".15"/>
  </svg>
);

const LocationPin = ({size=40, color='#1b6b3a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftBox = ({size=40, color='#1b6b3a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".08"/>
    <path d="M12 8v13" stroke={color} strokeWidth="1.5"/>
    <rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".12"/>
    <path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
    <path d="M12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
  </svg>
);

export default function WeddingModern({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 400); }, []);

  return (
    <div style={{ fontFamily: T.body, color: T.textDark, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{opacity:.3}50%{opacity:.6}100%{opacity:.3}}
      `}</style>

      {/* HERO */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, #0d1f0d 0%, #1a2e1a 30%, #1a3320 100%)`,
        color:T.textLight, overflow:'hidden',
      }}>
        {/* Islomiy geometrik fon */}
        <div style={{ position:'absolute', top:'5%', left:'5%', opacity:.08, animation:'shimmer 6s ease infinite' }}><IslamicStar size={80} color="#fff"/></div>
        <div style={{ position:'absolute', top:'15%', right:'8%', opacity:.06 }}><IslamicStar size={50} color="#fff"/></div>
        <div style={{ position:'absolute', bottom:'20%', left:'10%', opacity:.05 }}><IslamicStar size={60} color="#fff"/></div>
        <div style={{ position:'absolute', bottom:'30%', right:'5%', opacity:.07, animation:'shimmer 8s ease 2s infinite' }}><IslamicStar size={40} color="#fff"/></div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120, background:`linear-gradient(transparent,${T.bg})` }}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.4s ease', position:'relative', zIndex:1 }}>
          {/* Bismillah */}
          <Bismillah size={200} color={T.goldLight}/>

          <div style={{ margin:'20px 0 16px' }}>
            <IslamicDivider color={T.goldLight}/>
          </div>

          <div style={{ animation:'floatSlow 5s ease-in-out infinite', margin:'0 0 12px' }}>
            <CrescentStar size={44} color={T.goldLight}/>
          </div>

          <div style={{ fontSize:11, letterSpacing:6, textTransform:'uppercase', color:T.gold, marginBottom:16 }}>Nikoh to'yi</div>

          <div style={{ fontFamily:T.font, fontSize:40, fontWeight:700, letterSpacing:3, textShadow:'0 2px 20px rgba(0,0,0,0.3)', lineHeight:1.15 }}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{ fontFamily:T.font, fontSize:20, color:T.gold, margin:'8px 0', letterSpacing:3 }}>✦</div>
          <div style={{ fontFamily:T.font, fontSize:40, fontWeight:700, letterSpacing:3, textShadow:'0 2px 20px rgba(0,0,0,0.3)', lineHeight:1.15 }}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{ margin:'20px 0 14px' }}>
            <IslamicDivider color={T.goldLight}/>
          </div>

          <div style={{ fontSize:16, fontStyle:'italic', color:T.goldLight, opacity:.8, letterSpacing:1 }}>Nikoh to'yimizga taklif etamiz</div>

          <Countdown date={d.date||'2026-06-15'} style={{ marginTop:28, position:'relative', zIndex:1 }}
            itemStyle={{ background:'rgba(201,168,76,0.15)', borderColor:'rgba(201,168,76,0.3)' }}
            numStyle={{ color:T.gold }} />
        </div>

        <div style={{ position:'absolute', bottom:40, zIndex:2, animation:'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.gold} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* LOVE LETTER */}
      <Reveal style={{ padding:'56px 24px', textAlign:'center', background:T.bg }}>
        <IslamicArch width={240} height={36} color={T.gold}/>
        <div style={{ margin:'16px 0' }}>
          <MosqueSilhouette size={70} color={T.accent}/>
        </div>
        <h2 style={{ fontFamily:T.font, fontSize:26, fontWeight:600, color:T.textDark, marginBottom:16 }}>Alloh barakasini bersin</h2>
        <p style={{ fontSize:16, fontStyle:'italic', lineHeight:1.75, color:T.textMuted, maxWidth:340, margin:'0 auto' }}>
          {d.mainText||'"Aziz mehmonlarimiz, Alloh taolo bizga nasib etgan baxt kunini siz bilan birga nishonlashni istaymiz. Sizning duo va tashrifingiz biz uchun ulkan ne\'matdir."'}
        </p>
      </Reveal>

      {/* DIVIDER */}
      <div style={{ padding:'0 20px', background:T.bg }}><IslamicDivider color={T.gold}/></div>

      {/* CALENDAR */}
      <Reveal style={{ padding:'50px 20px', background:T.bg }}>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding:'50px 20px', textAlign:'center', background:T.bg }}>
          <div style={{ marginBottom:10, opacity:locSeen?1:0, transform:locSeen?'scale(1)':'scale(0.5)', transition:'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>
            <LocationPin size={44} color={T.accent}/>
          </div>
          <h2 style={{ fontFamily:T.font, fontSize:24, fontWeight:600, marginBottom:20, opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .6s ease .15s' }}>To'yxona manzili</h2>
          <div style={{ opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(30px)', transition:'all .8s ease .25s' }}>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* GIFT CARD */}
      {d.cardNumber && (
        <div ref={giftRef} style={{ padding:'50px 20px', textAlign:'center', background:T.bg }}>
          <div style={{ marginBottom:10, opacity:giftSeen?1:0, transform:giftSeen?'scale(1)':'scale(0.3)', transition:'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>
            <GiftBox size={44} color={T.accent}/>
          </div>
          <h2 style={{ fontFamily:T.font, fontSize:24, fontWeight:600, marginBottom:12, opacity:giftSeen?1:0, transition:'all .6s ease .1s' }}>To'yona va tabriklar</h2>
          <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 24px', opacity:giftSeen?1:0, transition:'all .6s ease .25s' }}>
            Sizning duo va tilaklaringiz biz uchun qadrli.
          </p>
          <div style={{ opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease .4s' }}>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} accentFrom={T.accent} accentTo={T.accentLight} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding:'50px 24px 40px', textAlign:'center', background:`linear-gradient(180deg,${T.bg},#e8e2d4)` }}>
        <IslamicArch width={200} height={30} color={T.gold}/>
        <h2 style={{ fontFamily:T.font, fontSize:24, fontWeight:600, marginBottom:20, marginTop:16 }}>Javobingiz</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      {/* FOOTER */}
      <div style={{ padding:'28px 20px', textAlign:'center', background:'#e8e2d4' }}>
        <CrescentStar size={24} color={T.gold}/>
        <div style={{ fontSize:13, color:'#7a7060', marginTop:8 }}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
