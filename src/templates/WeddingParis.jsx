import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

// "Parisdagi tun" — qorong'u romantik, oltin chiroqlar, yomg'ir
const T = {
  bg: '#1a1520',
  bgCard: '#221c28',
  bgWarm: '#f5ede4',
  cream: '#f0e8dd',
  gold: '#d4a060',
  goldLight: '#e8bc80',
  goldDim: '#a07838',
  rose: '#c8908a',
  roseLight: '#e0b0aa',
  textDark: '#1a1218',
  textMuted: '#8a7a70',
  textLight: '#f0e8dd',
  textGlow: '#e8d0b8',
  font: "'Playfair Display',serif",
  body: "'Cormorant Garamond',serif",
};

// ========== SVG BEZAKLAR ==========

const GoldOrnament = ({color='#d4a060'}) => (
  <svg width="160" height="18" viewBox="0 0 160 18" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="9" x2="55" y2="9" stroke={color} strokeWidth="0.4" opacity=".3"/>
    <path d="M68 9 L72 4 L76 9 L72 14Z" fill={color} opacity=".3"/>
    <circle cx="80" cy="9" r="2.5" fill={color} opacity=".4"/>
    <path d="M84 9 L88 4 L92 9 L88 14Z" fill={color} opacity=".3"/>
    <line x1="105" y1="9" x2="160" y2="9" stroke={color} strokeWidth="0.4" opacity=".3"/>
  </svg>
);

const SectionTitle = ({children, light=false, color='#d4a060'}) => (
  <div style={{textAlign:'center', marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
      <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill={color} opacity=".4"/></svg>
      <span style={{fontFamily:T.font, fontSize:12, letterSpacing:5, textTransform:'uppercase', fontWeight:600, color:light?T.textLight:T.textDark}}>{children}</span>
      <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill={color} opacity=".4"/></svg>
    </div>
  </div>
);

const HeartShape = ({size=20, color='#d4a060'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{display:'block',margin:'0 auto'}}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity=".6"/>
  </svg>
);

// Yomg'ir tomchilari
const RainDrop = ({x, delay, dur, h=80}) => (
  <div style={{
    position:'absolute', left:x, top:'-5%',
    width:1.5, height:h + '%' === '%' ? 12 : h/6,
    background:'linear-gradient(180deg, transparent, rgba(200,190,170,0.15))',
    animation:`rainFall ${dur}s linear ${delay}s infinite`, pointerEvents:'none',
    borderRadius:2,
  }}/>
);

// Chiroq yaltirashi
const LanternGlow = ({x, y, size=60, color='rgba(212,160,96,0.08)'}) => (
  <div style={{
    position:'absolute', left:x, top:y, width:size, height:size, borderRadius:'50%',
    background:`radial-gradient(circle, ${color} 0%, transparent 70%)`,
    animation:'lanternPulse 4s ease-in-out infinite', pointerEvents:'none'
  }}/>
);

const LocationPin = ({size=40, color='#d4a060'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftIcon = ({size=40, color='#d4a060'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".08"/>
    <path d="M12 8v13" stroke={color} strokeWidth="1.5"/>
    <rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".12"/>
    <path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
    <path d="M12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
  </svg>
);

export default function WeddingParis({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 500); }, []);

  return (
    <div style={{ fontFamily: T.body, color: T.textLight, overflowX: 'hidden', background: T.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes rainFall{0%{transform:translateY(-10vh);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(110vh);opacity:0}}
        @keyframes lanternPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes glowText{0%,100%{text-shadow:0 0 20px rgba(212,160,96,0.3)}50%{text-shadow:0 0 40px rgba(212,160,96,0.6)}}
        @keyframes floatHeart{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>

      {/* ============ HERO — Parij tuni + yomg'ir ============ */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, rgba(26,21,32,0.3) 0%, rgba(26,21,32,0.5) 40%, rgba(26,21,32,0.88) 100%), url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80') center/cover`,
        color:T.textLight, overflow:'hidden',
      }}>
        {/* Yomg'ir */}
        {[...Array(20)].map((_, i) => (
          <RainDrop key={i} x={`${i * 5}%`} delay={Math.random() * 3} dur={1.5 + Math.random() * 1.5}/>
        ))}

        {/* Chiroq yaltirashi */}
        <LanternGlow x="10%" y="15%" size={80}/>
        <LanternGlow x="75%" y="10%" size={60}/>
        <LanternGlow x="85%" y="60%" size={50}/>
        <LanternGlow x="5%" y="55%" size={40}/>

        <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:`linear-gradient(transparent,${T.bg})`}}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.5s ease', position:'relative', zIndex:1 }}>
          <div style={{fontSize:11, letterSpacing:5, textTransform:'uppercase', color:T.goldLight, marginBottom:20}}>To'y marosimiga taklif qilamiz</div>

          <div style={{fontFamily:T.font, fontSize:48, fontWeight:700, letterSpacing:2, lineHeight:1.05, animation:'glowText 4s ease infinite'}}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{fontFamily:T.font, fontSize:28, color:T.rose, margin:'6px 0', fontStyle:'italic', fontWeight:400}}>and</div>
          <div style={{fontFamily:T.font, fontSize:48, fontWeight:700, letterSpacing:2, lineHeight:1.05, color:T.goldLight, animation:'glowText 4s ease 1s infinite'}}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{margin:'18px 0 12px'}}><GoldOrnament color={T.goldLight}/></div>

          <div style={{fontSize:15, fontStyle:'italic', color:T.roseLight, opacity:.8, maxWidth:280, margin:'0 auto'}}>
            Bizning eng go'zal kunimizda sizni ham ko'rishni istaymiz
          </div>

          <div style={{marginTop:16, animation:'floatHeart 3s ease infinite'}}>
            <HeartShape size={22} color={T.rose}/>
          </div>
        </div>

        <div style={{position:'absolute',bottom:40,zIndex:2,animation:'bounce 2s infinite'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.goldLight} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* ============ COUNTDOWN — Qorong'u ============ */}
      <div style={{background:T.bg, padding:'40px 24px', textAlign:'center'}}>
        <SectionTitle light color={T.gold}>To'y marosimigacha</SectionTitle>
        <Countdown date={d.date||'2026-06-15'}
          style={{marginTop:8}}
          itemStyle={{background:'rgba(212,160,96,0.08)', borderColor:'rgba(212,160,96,0.2)', width:65, height:65}}
          numStyle={{color:T.goldLight, fontSize:22}}
          lblStyle={{color:T.textGlow}}
        />
      </div>

      {/* ============ MATN — Tungi manzara ============ */}
      <Reveal style={{padding:'50px 24px', textAlign:'center', position:'relative', overflow:'hidden',
        background:`linear-gradient(180deg, ${T.bg}, rgba(34,28,40,0.95)), url('https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=600&q=60') center/cover`}}>
        <p style={{fontSize:18, fontStyle:'italic', lineHeight:1.8, color:T.textGlow, maxWidth:300, margin:'0 auto', fontFamily:T.font, position:'relative', zIndex:1}}>
          {d.mainText||'"Qalblarimiz bir, yo\'limiz bir, bugun boshlangan bu sevgi abadiy bo\'lsin."'}
        </p>
        <div style={{marginTop:16, animation:'floatHeart 3s ease infinite', position:'relative', zIndex:1}}>
          <HeartShape size={18} color={T.rose}/>
        </div>
      </Reveal>

      {/* ============ KALENDAR — Iliq fon ============ */}
      <Reveal style={{padding:'50px 20px', background:T.bgWarm}}>
        <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Marosim sanasi</span></SectionTitle>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.rose} textColor={T.textDark} />
      </Reveal>

      {/* ============ LOKATSIYA — Qorong'u ============ */}
      {d.address && (
        <div ref={locRef} style={{padding:'50px 20px', textAlign:'center', background:T.bgCard}}>
          <SectionTitle light color={T.gold}>Lokatsiya</SectionTitle>
          <div style={{opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <div style={{marginBottom:12}}><LocationPin size={40} color={T.gold}/></div>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* ============ SOVG'A — Iliq fon ============ */}
      {d.cardNumber && (
        <div ref={giftRef} style={{padding:'50px 20px', textAlign:'center', background:T.bgWarm}}>
          <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Sovg'a</span></SectionTitle>
          <div style={{opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <p style={{fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 20px'}}>
              Sizning samimiy tilaklaringiz biz uchun eng katta sovg'a. Agar xohlasangiz, karta orqali tabrik yo'llashingiz mumkin.
            </p>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} cardType="HUMO" accentFrom={T.bgCard} accentTo={T.bg} />
          </div>
        </div>
      )}

      {/* ============ RSVP — Qorong'u ============ */}
      <Reveal style={{padding:'50px 24px 40px', textAlign:'center', background:T.bg}}>
        <SectionTitle light color={T.gold}>Taklifni tasdiqlang</SectionTitle>
        <div style={{fontSize:14, color:T.goldLight, opacity:.5, marginBottom:20}}>Ishtirokingiz biz uchun muhim</div>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.rose} textColor={T.textLight} />
      </Reveal>

      {/* ============ FOOTER ============ */}
      <div style={{padding:'28px 20px', textAlign:'center', background:'#12101a'}}>
        <GoldOrnament color={T.gold}/>
        <HeartShape size={16} color={T.rose}/>
        <div style={{fontSize:14, color:T.roseLight, marginTop:8, fontFamily:T.font, letterSpacing:2}}>
          Sizni intiqlik bilan kutamiz
        </div>
        <div style={{fontSize:12, color:'rgba(212,160,96,0.25)', marginTop:6}}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
