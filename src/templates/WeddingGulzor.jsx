import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

// "Sehrli qasr" — ertakli, pushti-oltin, qasr va gullar
const T = {
  bg: '#fdf5f0',
  bgWarm: '#f8ede4',
  bgDark: '#3d2b2b',
  bgDeep: '#2a1c1c',
  rose: '#c4788a',
  roseDark: '#9e5a6a',
  roseLight: '#e8a0b0',
  gold: '#c9a050',
  goldLight: '#dbb870',
  goldDim: '#a08030',
  cream: '#faf3ea',
  textDark: '#3a2525',
  textMuted: '#6a5555',
  textLight: '#faf0ea',
  font: "'Playfair Display',serif",
  body: "'Cormorant Garamond',serif",
};

// ========== SVG BEZAKLAR ==========

const GoldOrnament = ({color='#c9a050'}) => (
  <svg width="180" height="20" viewBox="0 0 180 20" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="10" x2="60" y2="10" stroke={color} strokeWidth="0.5" opacity=".3"/>
    <path d="M75 10 L80 4 L85 10 L80 16Z" fill={color} opacity=".35"/>
    <circle cx="90" cy="10" r="3" fill={color} opacity=".4"/>
    <path d="M95 10 L100 4 L105 10 L100 16Z" fill={color} opacity=".35"/>
    <line x1="120" y1="10" x2="180" y2="10" stroke={color} strokeWidth="0.5" opacity=".3"/>
  </svg>
);

const SectionTitle = ({children, color='#c9a050'}) => (
  <div style={{textAlign:'center', marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
      <svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 1 L12.5 7.5 L19 7.5 L14 12 L16 19 L10 15 L4 19 L6 12 L1 7.5 L7.5 7.5Z" fill={color} opacity=".4"/></svg>
      <span style={{fontFamily:T.font, fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:600}}>{children}</span>
      <svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 1 L12.5 7.5 L19 7.5 L14 12 L16 19 L10 15 L4 19 L6 12 L1 7.5 L7.5 7.5Z" fill={color} opacity=".4"/></svg>
    </div>
  </div>
);

// Oq qu
const SwanShape = ({size=80, color='#fff'}) => (
  <svg width={size} height={size*0.65} viewBox="0 0 100 65" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M68 50 C68 50 70 32 64 23 C58 14 50 9 48 7 C46 5 44 2 42 2 C40 2 38 4 38 6.5 C38 9 40 11 42 13 C44 15 46 19 46 24 C46 33 41 42 36 47 C31 52 22 54 17 54" stroke={color} strokeWidth="1.5" fill="none" opacity=".8"/>
    <ellipse cx="42" cy="3.5" rx="2.5" ry="2" fill={color} opacity=".7"/>
    <circle cx="41" cy="3" r="0.8" fill="#555" opacity=".4"/>
    <path d="M17 54 Q32 60 50 57 Q68 53 78 56 Q88 58 92 54" stroke={color} strokeWidth="0.7" fill="none" opacity=".25"/>
    <ellipse cx="55" cy="56" rx="22" ry="5" fill={color} opacity=".05"/>
  </svg>
);

// Pushti gul
const RoseFlower = ({size=30, color='#c4788a'}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{display:'inline-block'}}>
    <ellipse cx="15" cy="12" rx="5" ry="6" fill={color} opacity=".25" transform="rotate(-20 15 12)"/>
    <ellipse cx="15" cy="12" rx="5" ry="6" fill={color} opacity=".2" transform="rotate(20 15 12)"/>
    <ellipse cx="15" cy="12" rx="5" ry="6" fill={color} opacity=".15" transform="rotate(60 15 12)"/>
    <ellipse cx="15" cy="12" rx="3.5" ry="4" fill={color} opacity=".35"/>
    <circle cx="15" cy="12" r="1.5" fill={color} opacity=".5"/>
    <path d="M15 18 Q14 22 13 26" stroke="#5a8a50" strokeWidth="0.8" opacity=".3"/>
    <ellipse cx="11" cy="22" rx="3" ry="1.5" fill="#5a8a50" opacity=".15" transform="rotate(-30 11 22)"/>
  </svg>
);

// Gul burchak bezak
const FloralCorner = ({position='bottom-right', color='#c4788a', size=130}) => {
  const flip = position.includes('left') ? 'scaleX(-1)' : 'scaleX(1)';
  const isTop = position.includes('top');
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none"
      style={{position:'absolute', [isTop?'top':'bottom']:0, [position.includes('left')?'left':'right']:0, transform:flip+(isTop?' scaleY(-1)':''), opacity:.18, pointerEvents:'none'}}>
      <path d="M130 130 C108 100 82 112 60 106 C38 100 28 78 33 58 C38 38 56 28 72 34 C88 40 92 58 86 72" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="86" cy="72" r="10" fill={color} opacity=".2"/>
      <circle cx="72" cy="34" r="7" fill={color} opacity=".15"/>
      <circle cx="33" cy="58" r="8" fill={color} opacity=".12"/>
      <circle cx="112" cy="82" r="5" fill={color} opacity=".1"/>
      <circle cx="95" cy="105" r="6" fill={color} opacity=".08"/>
      <path d="M86 72 C96 65 108 72 115 82" stroke={color} strokeWidth="0.7" fill="none"/>
      <path d="M86 72 C80 84 86 100 96 108" stroke={color} strokeWidth="0.7" fill="none"/>
      <path d="M60 106 C48 112 36 118 22 118" stroke={color} strokeWidth="0.5" fill="none"/>
      <ellipse cx="86" cy="72" rx="14" ry="8" fill={color} opacity=".06" transform="rotate(-20 86 72)"/>
    </svg>
  );
};

// Yulduzcha (miltillovchi)
const Sparkle = ({x, y, delay=0, size=3, color='#dbb870'}) => (
  <div style={{
    position:'absolute', left:x, top:y, width:size, height:size, borderRadius:'50%',
    background:color, animation:`sparkle 3s ease-in-out ${delay}s infinite`, pointerEvents:'none'
  }}/>
);

// Gul patlar tushmoqda
const FallingPetal = ({x, delay, dur, color='#e8a0b0'}) => (
  <div style={{
    position:'absolute', left:x, top:'-10px',
    width:8, height:10, borderRadius:'50% 0 50% 50%', background:color,
    animation:`petalDrift ${dur}s ease-in ${delay}s infinite`, pointerEvents:'none', opacity:.4,
    transform:'rotate(45deg)'
  }}/>
);

const LocationPin = ({size=40, color='#c4788a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftIcon = ({size=40, color='#c4788a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".08"/>
    <path d="M12 8v13" stroke={color} strokeWidth="1.5"/>
    <rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".12"/>
    <path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
    <path d="M12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
  </svg>
);

const HeartShape = ({size=20, color='#c4788a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{display:'block',margin:'0 auto'}}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity=".7"/>
  </svg>
);

export default function WeddingGulzor({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 500); }, []);

  return (
    <div style={{ fontFamily: T.body, color: T.textDark, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes petalDrift{0%{transform:translateY(-10px) rotate(0) translateX(0);opacity:0}10%{opacity:.4}50%{transform:translateY(50vh) rotate(180deg) translateX(30px)}100%{transform:translateY(100vh) rotate(360deg) translateX(-20px);opacity:0}}
        @keyframes sparkle{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.8;transform:scale(1.5)}}
        @keyframes floatSwan{0%,100%{transform:translateY(0) translateX(0)}25%{transform:translateY(-8px) translateX(4px)}75%{transform:translateY(5px) translateX(-4px)}}
        @keyframes gateOpen{0%{opacity:0;transform:perspective(800px) rotateY(30deg) scale(0.9)}100%{opacity:1;transform:perspective(800px) rotateY(0) scale(1)}}
        @keyframes glowLantern{0%,100%{filter:drop-shadow(0 0 6px rgba(201,160,80,0.3))}50%{filter:drop-shadow(0 0 14px rgba(201,160,80,0.6))}}
      `}</style>

      {/* ============ HERO — Sehrli qasr ============ */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, rgba(61,43,43,0.35) 0%, rgba(61,43,43,0.5) 40%, rgba(61,43,43,0.85) 100%), url('https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80') center top/cover`,
        color:T.textLight, overflow:'hidden',
      }}>
        {/* Tushayotgan gul patlar */}
        {[...Array(8)].map((_, i) => (
          <FallingPetal key={i} x={`${5 + i * 12}%`} delay={i * 0.9} dur={5 + i * 0.6} color={i%2===0?T.roseLight:'#f0c8d0'}/>
        ))}

        {/* Miltillovchi yulduzchalar */}
        <Sparkle x="15%" y="12%" delay={0} size={3}/>
        <Sparkle x="80%" y="8%" delay={1.5} size={2}/>
        <Sparkle x="25%" y="25%" delay={0.8} size={2.5}/>
        <Sparkle x="70%" y="20%" delay={2} size={2}/>
        <Sparkle x="50%" y="5%" delay={1} size={3}/>

        <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:`linear-gradient(transparent,${T.bg})`}}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.5s ease', position:'relative', zIndex:1, animation: heroOn?'gateOpen 1.5s ease forwards':'none' }}>
          <div style={{fontSize:12, letterSpacing:4, textTransform:'uppercase', color:T.goldLight, marginBottom:20}}>To'y marosimiga taklif qilamiz</div>

          <div style={{fontFamily:T.font, fontSize:46, fontWeight:700, letterSpacing:2, lineHeight:1.1, textShadow:'0 2px 30px rgba(0,0,0,0.4)'}}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{fontFamily:T.font, fontSize:26, color:T.goldLight, margin:'6px 0', fontStyle:'italic'}}>and</div>
          <div style={{fontFamily:T.font, fontSize:46, fontWeight:700, letterSpacing:2, lineHeight:1.1, textShadow:'0 2px 30px rgba(0,0,0,0.4)'}}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{margin:'20px 0 10px'}}><GoldOrnament color={T.goldLight}/></div>

          <div style={{fontSize:15, fontStyle:'italic', color:T.goldLight, opacity:.8, maxWidth:280, margin:'0 auto'}}>
            Bizning eng go'zal kunimizda sizni ham ko'rishni istaymiz
          </div>

          {/* Kichik qu */}
          <div style={{marginTop:16, animation:'glowLantern 3s ease infinite'}}>
            <HeartShape size={24} color={T.roseLight}/>
          </div>
        </div>

        <div style={{position:'absolute',bottom:40,zIndex:2,animation:'bounce 2s infinite'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.goldLight} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* ============ COUNTDOWN — Iliq fon ============ */}
      <div style={{background:T.bgWarm, padding:'40px 24px', textAlign:'center'}}>
        <SectionTitle color={T.gold}><span style={{color:T.textDark}}>To'y marosimigacha</span></SectionTitle>
        <Countdown date={d.date||'2026-06-15'}
          style={{marginTop:8}}
          itemStyle={{background:'rgba(196,120,138,0.1)', borderColor:'rgba(196,120,138,0.25)', width:65, height:65}}
          numStyle={{color:T.textDark, fontSize:22}}
          lblStyle={{color:T.textMuted}}
        />
      </div>

      {/* ============ MATN + QU — Ko'l manzarali ============ */}
      <Reveal style={{padding:'50px 24px', textAlign:'center', background:`linear-gradient(180deg, ${T.bgWarm}, #e8d8c8)`, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.rose} size={140}/>
        <FloralCorner position='bottom-left' color={T.rose} size={140}/>
        <p style={{fontSize:17, fontStyle:'italic', lineHeight:1.8, color:T.textMuted, maxWidth:320, margin:'0 auto', fontFamily:T.font}}>
          {d.mainText||'"Qalblarimiz bir, yo\'limiz bir, bugun boshlangan bu sevgi abadiy bo\'lsin."'}
        </p>
        <div style={{marginTop:20, animation:'floatSwan 6s ease-in-out infinite'}}>
          <SwanShape size={90} color="rgba(100,80,60,0.25)"/>
        </div>
        <HeartShape size={16} color={T.roseLight}/>
      </Reveal>

      {/* ============ KALENDAR — Oq ============ */}
      <Reveal style={{padding:'50px 20px', background:T.cream, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='top-right' color={T.rose} size={110}/>
        <FloralCorner position='top-left' color={T.rose} size={110}/>
        <SectionTitle color={T.gold}><span style={{color:T.textDark}}>Marosim sanasi</span></SectionTitle>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.rose} textColor={T.textDark} />
      </Reveal>

      {/* ============ LOKATSIYA ============ */}
      {d.address && (
        <div ref={locRef} style={{padding:'50px 20px', textAlign:'center', background:T.bgWarm, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='bottom-right' color={T.rose} size={100}/>
          <FloralCorner position='bottom-left' color={T.rose} size={100}/>
          <SectionTitle color={T.gold}><span style={{color:T.textDark}}>Lokatsiya</span></SectionTitle>
          <div style={{opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <div style={{marginBottom:12}}><LocationPin size={40} color={T.rose}/></div>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* ============ SOVG'A ============ */}
      {d.cardNumber && (
        <div ref={giftRef} style={{padding:'50px 20px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='top-right' color={T.rose} size={120}/>
          <FloralCorner position='top-left' color={T.rose} size={120}/>
          <SectionTitle color={T.gold}><span style={{color:T.textDark}}>Sovg'a</span></SectionTitle>
          <div style={{opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <p style={{fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 20px'}}>
              Sizning samimiy tilaklaringiz biz uchun eng katta sovg'a. Agar xohlasangiz, karta orqali tabrik yo'llashingiz mumkin.
            </p>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} cardType="HUMO" accentFrom={T.rose} accentTo={T.roseDark} />
          </div>
        </div>
      )}

      {/* ============ GULLAR + QU ============ */}
      <div style={{padding:'30px 24px', textAlign:'center', background:T.bgWarm, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.rose} size={150}/>
        <FloralCorner position='bottom-left' color={T.rose} size={150}/>
        <FloralCorner position='top-right' color={T.gold} size={100}/>
        <FloralCorner position='top-left' color={T.gold} size={100}/>
        <div style={{animation:'floatSwan 7s ease-in-out infinite'}}>
          <SwanShape size={110} color="rgba(196,120,138,0.2)"/>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:8}}>
          <RoseFlower size={22} color={T.rose}/><RoseFlower size={28} color={T.roseLight}/><RoseFlower size={22} color={T.rose}/>
        </div>
      </div>

      {/* ============ RSVP — Qorong'u fon ============ */}
      <Reveal style={{padding:'50px 24px 40px', textAlign:'center', background:T.bgDark}}>
        <SectionTitle color={T.goldLight}><span style={{color:T.textLight}}>Taklifni tasdiqlang</span></SectionTitle>
        <div style={{fontSize:14, color:T.goldLight, opacity:.6, marginBottom:20}}>Ishtirokingiz biz uchun muhim</div>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.rose} textColor={T.textLight} />
      </Reveal>

      {/* ============ FOOTER ============ */}
      <div style={{padding:'28px 20px', textAlign:'center', background:T.bgDeep}}>
        <HeartShape size={18} color={T.roseLight}/>
        <div style={{fontSize:14, color:T.roseLight, marginTop:8, fontFamily:T.font, letterSpacing:2}}>
          Sizni intiqlik bilan kutamiz
        </div>
        <div style={{fontSize:12, color:'rgba(196,120,138,0.3)', marginTop:6}}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
