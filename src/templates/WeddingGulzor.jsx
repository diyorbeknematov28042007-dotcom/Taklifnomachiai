import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

const T = {
  bg: '#fdf5f0',
  bgWarm: '#f8ede4',
  bgDark: '#3d2b2b',
  bgDeep: '#2a1c1c',
  rose: '#c4788a',
  roseDark: '#9e5a6a',
  roseLight: '#e8a0b0',
  rosePale: '#f4d4dc',
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

const SectionTitle = ({children, color='#c9a050', light=false}) => (
  <div style={{textAlign:'center', marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
      <svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 1 L12.5 7.5 L19 7.5 L14 12 L16 19 L10 15 L4 19 L6 12 L1 7.5 L7.5 7.5Z" fill={color} opacity=".4"/></svg>
      <span style={{fontFamily:T.font, fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:600, color:light?T.textLight:T.textDark}}>{children}</span>
      <svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 1 L12.5 7.5 L19 7.5 L14 12 L16 19 L10 15 L4 19 L6 12 L1 7.5 L7.5 7.5Z" fill={color} opacity=".4"/></svg>
    </div>
  </div>
);

const HeartShape = ({size=20, color='#c4788a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{display:'block',margin:'0 auto'}}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity=".6"/>
  </svg>
);

// Atirgul SVG — pushti/oq
const Rose = ({size=35, color='#e8a0b0', opacity=0.6}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{display:'inline-block'}}>
    <ellipse cx="20" cy="16" rx="8" ry="10" fill={color} opacity={opacity*0.4} transform="rotate(-25 20 16)"/>
    <ellipse cx="20" cy="16" rx="8" ry="10" fill={color} opacity={opacity*0.35} transform="rotate(25 20 16)"/>
    <ellipse cx="20" cy="16" rx="7" ry="9" fill={color} opacity={opacity*0.3} transform="rotate(-60 20 16)"/>
    <ellipse cx="20" cy="16" rx="7" ry="9" fill={color} opacity={opacity*0.3} transform="rotate(60 20 16)"/>
    <ellipse cx="20" cy="16" rx="5" ry="6" fill={color} opacity={opacity*0.5}/>
    <ellipse cx="20" cy="16" rx="3" ry="3.5" fill={color} opacity={opacity*0.7}/>
    <circle cx="20" cy="15" r="1.5" fill={color} opacity={opacity*0.9}/>
    <path d="M20 26 Q19 32 17 37" stroke="#5a8a50" strokeWidth="0.8" opacity=".25"/>
    <ellipse cx="14" cy="32" rx="4" ry="2" fill="#5a8a50" opacity=".1" transform="rotate(-30 14 32)"/>
    <ellipse cx="25" cy="30" rx="3.5" ry="1.8" fill="#5a8a50" opacity=".08" transform="rotate(20 25 30)"/>
  </svg>
);

// Gul to'plami — pastki bezak uchun
const RoseGarden = ({count=7}) => {
  const roses = [];
  for(let i=0; i<count; i++){
    const isPink = i % 3 !== 0;
    const sz = 28 + (i % 3) * 10;
    const c = isPink ? (i%2===0 ? '#e8a0b0' : '#d48898') : '#f0d0d8';
    const op = 0.5 + (i%3)*0.15;
    roses.push(
      <div key={i} style={{display:'inline-block', margin:'0 -4px', transform:`translateY(${(i%3)*6}px) rotate(${-15+i*8}deg)`}}>
        <Rose size={sz} color={c} opacity={op}/>
      </div>
    );
  }
  return <div style={{textAlign:'center',lineHeight:0,padding:'0 10px'}}>{roses}</div>;
};

// Gul burchak bezak
const FloralCorner = ({position='bottom-right', color='#c4788a', size=130}) => {
  const flip = position.includes('left') ? 'scaleX(-1)' : 'scaleX(1)';
  const isTop = position.includes('top');
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none"
      style={{position:'absolute', [isTop?'top':'bottom']:0, [position.includes('left')?'left':'right']:0, transform:flip+(isTop?' scaleY(-1)':''), opacity:.2, pointerEvents:'none'}}>
      <circle cx="110" cy="110" r="14" fill={color} opacity=".2"/>
      <circle cx="95" cy="85" r="10" fill={color} opacity=".15"/>
      <circle cx="75" cy="105" r="12" fill={color} opacity=".18"/>
      <circle cx="115" cy="80" r="8" fill={color} opacity=".12"/>
      <circle cx="85" cy="115" r="9" fill={color} opacity=".14"/>
      <circle cx="60" cy="90" r="7" fill={color} opacity=".1"/>
      <circle cx="100" cy="60" r="6" fill={color} opacity=".08"/>
      <path d="M110 110 C100 95 85 100 75 105" stroke={color} strokeWidth="0.6" opacity=".15"/>
      <path d="M95 85 C88 78 75 80 65 88" stroke={color} strokeWidth="0.5" opacity=".1"/>
      <ellipse cx="105" cy="95" rx="18" ry="12" fill={color} opacity=".04" transform="rotate(-20 105 95)"/>
    </svg>
  );
};

// Miltillovchi yulduzcha
const Sparkle = ({x, y, delay=0, size=3, color='#dbb870'}) => (
  <div style={{
    position:'absolute', left:x, top:y, width:size, height:size, borderRadius:'50%',
    background:color, animation:`sparkle 3s ease-in-out ${delay}s infinite`, pointerEvents:'none'
  }}/>
);

// Tushayotgan gul patlar
const FallingPetal = ({x, delay, dur, color='#e8a0b0'}) => (
  <div style={{
    position:'absolute', left:x, top:'-5%',
    width:9, height:11, borderRadius:'50% 0 50% 50%', background:color,
    animation:`petalDrift ${dur}s ease-in ${delay}s infinite`, pointerEvents:'none', opacity:.35,
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
        @keyframes petalDrift{0%{transform:translateY(-10px) rotate(0) translateX(0);opacity:0}10%{opacity:.35}50%{transform:translateY(50vh) rotate(180deg) translateX(30px)}100%{transform:translateY(105vh) rotate(360deg) translateX(-20px);opacity:0}}
        @keyframes sparkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.7;transform:scale(1.6)}}
        @keyframes gateReveal{0%{opacity:0;transform:perspective(1000px) rotateY(40deg) scale(0.85)}100%{opacity:1;transform:perspective(1000px) rotateY(0) scale(1)}}
        @keyframes floatHeart{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes castleGlow{0%,100%{filter:drop-shadow(0 0 8px rgba(201,160,80,0.2))}50%{filter:drop-shadow(0 0 20px rgba(201,160,80,0.5))}}
      `}</style>

      {/* ============ HERO — Sehrli qasr darvozasi ============ */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, rgba(40,25,25,0.25) 0%, rgba(40,25,25,0.45) 40%, rgba(40,25,25,0.85) 100%), url('https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80') center top/cover`,
        color:T.textLight, overflow:'hidden',
      }}>
        {/* Tushayotgan gul patlar */}
        {[...Array(10)].map((_, i) => (
          <FallingPetal key={i} x={`${3 + i * 10}%`} delay={i * 0.7} dur={5 + i * 0.5}
            color={i%3===0 ? '#f4d4dc' : i%3===1 ? '#e8a0b0' : '#f0c0c8'}/>
        ))}

        {/* Sehrli yulduzchalar */}
        <Sparkle x="12%" y="10%" delay={0} size={3}/>
        <Sparkle x="82%" y="8%" delay={1.2} size={2.5}/>
        <Sparkle x="20%" y="28%" delay={0.6} size={2}/>
        <Sparkle x="75%" y="22%" delay={1.8} size={3}/>
        <Sparkle x="50%" y="5%" delay={0.9} size={2.5}/>
        <Sparkle x="90%" y="35%" delay={2.2} size={2}/>
        <Sparkle x="8%" y="40%" delay={1.5} size={2}/>

        <div style={{position:'absolute',bottom:0,left:0,right:0,height:140,background:`linear-gradient(transparent,${T.bg})`}}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.5s ease', position:'relative', zIndex:1, animation:heroOn?'gateReveal 1.8s ease forwards':'none' }}>

          <div style={{fontSize:11, letterSpacing:5, textTransform:'uppercase', color:T.goldLight, marginBottom:22}}>To'y marosimiga taklif qilamiz</div>

          <div style={{fontFamily:T.font, fontSize:48, fontWeight:700, letterSpacing:2, lineHeight:1.05, textShadow:'0 2px 30px rgba(0,0,0,0.5)', animation:'castleGlow 4s ease infinite'}}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{fontFamily:T.font, fontSize:28, color:T.goldLight, margin:'6px 0', fontStyle:'italic', fontWeight:400}}>and</div>
          <div style={{fontFamily:T.font, fontSize:48, fontWeight:700, letterSpacing:2, lineHeight:1.05, textShadow:'0 2px 30px rgba(0,0,0,0.5)'}}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{margin:'20px 0 12px'}}><GoldOrnament color={T.goldLight}/></div>

          <div style={{fontSize:15, fontStyle:'italic', color:T.roseLight, opacity:.85, maxWidth:280, margin:'0 auto'}}>
            Bizning eng go'zal kunimizda sizni ham ko'rishni istaymiz
          </div>

          <div style={{marginTop:14, animation:'floatHeart 3s ease infinite'}}>
            <HeartShape size={22} color={T.roseLight}/>
          </div>
        </div>

        <div style={{position:'absolute',bottom:40,zIndex:2,animation:'bounce 2s infinite'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.goldLight} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* ============ COUNTDOWN ============ */}
      <div style={{background:T.bgWarm, padding:'40px 24px', textAlign:'center'}}>
        <SectionTitle color={T.gold}>To'y marosimigacha</SectionTitle>
        <Countdown date={d.date||'2026-06-15'}
          style={{marginTop:8}}
          itemStyle={{background:'rgba(196,120,138,0.1)', borderColor:'rgba(196,120,138,0.2)', width:65, height:65}}
          numStyle={{color:T.textDark, fontSize:22}}
          lblStyle={{color:T.textMuted}}
        />
      </div>

      {/* ============ MATN + gullar ============ */}
      <Reveal style={{padding:'50px 24px', textAlign:'center', background:T.bg, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='top-right' color={T.rose} size={120}/>
        <FloralCorner position='top-left' color={T.rose} size={120}/>
        <p style={{fontSize:18, fontStyle:'italic', lineHeight:1.8, color:T.textMuted, maxWidth:320, margin:'0 auto', fontFamily:T.font}}>
          {d.mainText||'"Qalblarimiz bir, yo\'limiz bir, bugun boshlangan bu sevgi abadiy bo\'lsin."'}
        </p>
        <div style={{marginTop:16, animation:'floatHeart 3s ease infinite'}}>
          <HeartShape size={18} color={T.roseLight}/>
        </div>
      </Reveal>

      {/* ============ ATIRGULLAR QATORI ============ */}
      <div style={{background:T.bg, padding:'10px 0 20px', textAlign:'center'}}>
        <RoseGarden count={9}/>
      </div>

      {/* ============ KALENDAR ============ */}
      <Reveal style={{padding:'50px 20px', background:T.cream, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.rosePale} size={110}/>
        <FloralCorner position='bottom-left' color={T.rosePale} size={110}/>
        <SectionTitle color={T.gold}>Marosim sanasi</SectionTitle>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.rose} textColor={T.textDark} />
      </Reveal>

      {/* ============ ATIRGULLAR ============ */}
      <div style={{background:T.cream, padding:'0 0 10px', textAlign:'center'}}>
        <RoseGarden count={7}/>
      </div>

      {/* ============ LOKATSIYA ============ */}
      {d.address && (
        <div ref={locRef} style={{padding:'50px 20px', textAlign:'center', background:T.bgWarm, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='top-right' color={T.rose} size={100}/>
          <FloralCorner position='top-left' color={T.rose} size={100}/>
          <SectionTitle color={T.gold}>Lokatsiya</SectionTitle>
          <div style={{opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <div style={{marginBottom:12}}><LocationPin size={40} color={T.rose}/></div>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* ============ SOVG'A ============ */}
      {d.cardNumber && (
        <div ref={giftRef} style={{padding:'50px 20px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='bottom-right' color={T.rosePale} size={120}/>
          <FloralCorner position='bottom-left' color={T.rosePale} size={120}/>
          <SectionTitle color={T.gold}>Sovg'a</SectionTitle>
          <div style={{opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <p style={{fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 20px'}}>
              Sizning samimiy tilaklaringiz biz uchun eng katta sovg'a.
            </p>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} cardType="HUMO" accentFrom={T.rose} accentTo={T.roseDark} />
          </div>
        </div>
      )}

      {/* ============ KATTA GUL BOG'I ============ */}
      <div style={{background:`linear-gradient(180deg, ${T.cream}, ${T.bgWarm})`, padding:'20px 0 30px', textAlign:'center', position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.rose} size={160}/>
        <FloralCorner position='bottom-left' color={T.rose} size={160}/>
        <FloralCorner position='top-right' color={T.rosePale} size={120}/>
        <FloralCorner position='top-left' color={T.rosePale} size={120}/>
        <RoseGarden count={11}/>
        <div style={{marginTop:10}}><GoldOrnament color={T.goldDim}/></div>
        <RoseGarden count={9}/>
      </div>

      {/* ============ RSVP ============ */}
      <Reveal style={{padding:'50px 24px 40px', textAlign:'center', background:T.bgDark}}>
        <SectionTitle light color={T.goldLight}>Taklifni tasdiqlang</SectionTitle>
        <div style={{fontSize:14, color:T.goldLight, opacity:.5, marginBottom:20}}>Ishtirokingiz biz uchun muhim</div>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.rose} textColor={T.textLight} />
      </Reveal>

      {/* ============ FOOTER ============ */}
      <div style={{padding:'28px 20px', textAlign:'center', background:T.bgDeep, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.rosePale} size={80}/>
        <FloralCorner position='bottom-left' color={T.rosePale} size={80}/>
        <HeartShape size={18} color={T.roseLight}/>
        <div style={{fontSize:14, color:T.roseLight, marginTop:8, fontFamily:T.font, letterSpacing:2}}>
          Sizni intiqlik bilan kutamiz
        </div>
        <div style={{fontSize:12, color:'rgba(196,120,138,0.25)', marginTop:6}}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
