import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

// RANGLAR — "Oq qush ko'li" dizaynidan
const T = {
  heroGreen: '#2a3d2a',
  green: '#3a5a3a',
  greenDark: '#1e3328',
  greenDeep: '#0f1f15',
  gold: '#c4a855',
  goldLight: '#dcc878',
  goldDim: '#9a8540',
  cream: '#f5f0e0',
  creamLight: '#faf6eb',
  warmGray: '#e8e0d0',
  textDark: '#2a2518',
  textMuted: '#5a5240',
  textLight: '#f0ead6',
  font: "'Playfair Display',serif",
  body: "'Cormorant Garamond',serif",
};

// ========== SVG BEZAKLAR ==========

const Bismillah = ({color='#c4a855'}) => (
  <svg width="200" height="45" viewBox="0 0 200 45" style={{display:'block',margin:'0 auto'}}>
    <text x="100" y="30" textAnchor="middle" fontFamily="'Traditional Arabic','Times New Roman',serif" fontSize="30" fill={color} opacity=".9">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</text>
  </svg>
);

const GoldOrnament = ({color='#c4a855'}) => (
  <svg width="160" height="20" viewBox="0 0 160 20" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="10" x2="55" y2="10" stroke={color} strokeWidth="0.5" opacity=".3"/>
    <path d="M70 10 L75 4 L80 10 L75 16Z" fill={color} opacity=".4"/>
    <circle cx="80" cy="10" r="2" fill={color} opacity=".5"/>
    <path d="M80 10 L85 4 L90 10 L85 16Z" fill={color} opacity=".4"/>
    <line x1="105" y1="10" x2="160" y2="10" stroke={color} strokeWidth="0.5" opacity=".3"/>
  </svg>
);

const SectionTitle = ({children, color='#c4a855'}) => (
  <div style={{textAlign:'center', marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
      <svg width="18" height="18" viewBox="0 0 20 20"><polygon points="10,1 12,7 19,7 14,11 16,18 10,14 4,18 6,11 1,7 8,7" fill={color} opacity=".5"/></svg>
      <span style={{fontFamily:T.font, fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:600}}>{children}</span>
      <svg width="18" height="18" viewBox="0 0 20 20"><polygon points="10,1 12,7 19,7 14,11 16,18 10,14 4,18 6,11 1,7 8,7" fill={color} opacity=".5"/></svg>
    </div>
  </div>
);

// Oq qu (swan) SVG
const SwanShape = ({size=80, color='#fff'}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 100 70" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M70 55 C70 55 72 35 65 25 C58 15 50 10 48 8 C46 6 44 2 42 2 C40 2 38 4 38 7 C38 10 40 12 42 14 C44 16 46 20 46 25 C46 35 40 45 35 50 C30 55 20 58 15 58 C10 58 5 55 5 55" stroke={color} strokeWidth="1.5" fill="none" opacity=".8"/>
    <ellipse cx="42" cy="4" rx="2.5" ry="2" fill={color} opacity=".7"/>
    <circle cx="41" cy="3.5" r="0.8" fill="#333" opacity=".5"/>
    <path d="M15 58 Q30 65 50 62 Q70 58 80 60 Q90 62 95 58" stroke={color} strokeWidth="0.8" fill="none" opacity=".3"/>
    <ellipse cx="55" cy="60" rx="25" ry="6" fill={color} opacity=".06"/>
  </svg>
);

// Patlar (tushayotgan)
const Feather = ({x, delay, dur}) => (
  <div style={{
    position:'absolute', left:x, top:'-10px', fontSize:16, color:'#fff',
    animation:`featherFall ${dur}s ease-in ${delay}s infinite`, pointerEvents:'none', opacity:.4
  }}>𓆩</div>
);

// Gul bezak burchaklar uchun
const FloralCorner = ({position='bottom-right', color='#c4a855', size=120}) => {
  const flip = position.includes('left') ? 'scaleX(-1)' : 'scaleX(1)';
  const isTop = position.includes('top');
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none"
      style={{position:'absolute', [isTop?'top':'bottom']:0, [position.includes('left')?'left':'right']:0, transform:flip+(isTop?' scaleY(-1)':''), opacity:.12, pointerEvents:'none'}}>
      <path d="M120 120 C100 95 75 105 55 100 C35 95 25 75 30 55 C35 35 55 28 70 33 C85 38 88 55 82 68" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="82" cy="68" r="10" fill={color} opacity=".15"/>
      <circle cx="70" cy="33" r="7" fill={color} opacity=".12"/>
      <circle cx="30" cy="55" r="8" fill={color} opacity=".1"/>
      <path d="M82 68 C92 62 104 68 110 78" stroke={color} strokeWidth="0.7" fill="none"/>
      <path d="M82 68 C78 80 82 95 92 102" stroke={color} strokeWidth="0.7" fill="none"/>
      <circle cx="110" cy="78" r="5" fill={color} opacity=".1"/>
      <circle cx="92" cy="102" r="6" fill={color} opacity=".08"/>
      <ellipse cx="55" cy="100" rx="14" ry="8" fill={color} opacity=".05" transform="rotate(-15 55 100)"/>
    </svg>
  );
};

// Suv to'lqini (wave) ajratuvchi
const WaveDivider = ({color='#3a5a3a', bg='#f5f0e0'}) => (
  <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none" style={{display:'block'}}>
    <path d="M0 15 Q50 0 100 15 Q150 30 200 15 Q250 0 300 15 Q350 30 400 15 L400 40 L0 40Z" fill={bg}/>
    <path d="M0 15 Q50 0 100 15 Q150 30 200 15 Q250 0 300 15 Q350 30 400 15" stroke={color} strokeWidth="0.5" fill="none" opacity=".2"/>
  </svg>
);

const LocationPin = ({size=40, color='#3a5a3a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftIcon = ({size=40, color='#3a5a3a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".08"/>
    <path d="M12 8v13" stroke={color} strokeWidth="1.5"/>
    <rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity=".12"/>
    <path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
    <path d="M12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity=".08"/>
  </svg>
);

export default function WeddingDark({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 500); }, []);

  return (
    <div style={{ fontFamily: T.body, color: T.textDark, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
        @keyframes featherFall{0%{transform:translateY(-20px) rotate(0) translateX(0);opacity:0}10%{opacity:.4}50%{transform:translateY(50vh) rotate(45deg) translateX(20px)}100%{transform:translateY(100vh) rotate(90deg) translateX(-10px);opacity:0}}
        @keyframes floatSwan{0%,100%{transform:translateY(0) translateX(0)}25%{transform:translateY(-6px) translateX(3px)}75%{transform:translateY(4px) translateX(-3px)}}
        @keyframes shimmerGold{0%,100%{opacity:.3}50%{opacity:.6}}
        @keyframes ripple{0%{transform:scale(1);opacity:.3}100%{transform:scale(2.5);opacity:0}}
      `}</style>

      {/* ============ HERO — Ko'l va oq qu ============ */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, rgba(30,51,40,0.4) 0%, rgba(42,61,42,0.55) 40%, rgba(30,51,40,0.85) 100%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80') center/cover`,
        color:T.textLight, overflow:'hidden',
      }}>
        {/* Patlar tushmoqda */}
        {[...Array(6)].map((_, i) => (
          <Feather key={i} x={`${10 + i * 15}%`} delay={i * 1.2} dur={5 + i * 0.8} />
        ))}

        <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:`linear-gradient(transparent,${T.greenDark})`}}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.5s ease', position:'relative', zIndex:1 }}>
          <Bismillah color={T.goldLight}/>
          <div style={{fontSize:11, letterSpacing:5, textTransform:'uppercase', color:T.gold, marginTop:10, marginBottom:20}}>Nikoh oqshomiga taklif qilamiz</div>

          <div style={{fontFamily:T.font, fontSize:44, fontWeight:700, letterSpacing:3, lineHeight:1.1, textShadow:'0 2px 24px rgba(0,0,0,0.4)'}}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{fontFamily:T.font, fontSize:30, color:T.gold, margin:'6px 0', fontStyle:'italic'}}>&</div>
          <div style={{fontFamily:T.font, fontSize:44, fontWeight:700, letterSpacing:3, lineHeight:1.1, textShadow:'0 2px 24px rgba(0,0,0,0.4)'}}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{marginTop:16, marginBottom:12}}>
            <GoldOrnament color={T.goldLight}/>
          </div>

          <div style={{fontSize:14, fontStyle:'italic', color:T.goldLight, opacity:.75, maxWidth:280, margin:'0 auto', lineHeight:1.6}}>
            "Va Ular uchun o'z juftlaridan sokinlik yaratdi."
            <br/><span style={{fontSize:12, opacity:.6}}>(Ar-Rum 21)</span>
          </div>

          {/* Oq qu */}
          <div style={{marginTop:20, animation:'floatSwan 6s ease-in-out infinite'}}>
            <SwanShape size={90} color="rgba(255,255,255,0.7)"/>
          </div>
        </div>

        <div style={{position:'absolute',bottom:40,zIndex:2,animation:'bounce 2s infinite'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.gold} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* ============ COUNTDOWN — Yashil fon ============ */}
      <div style={{background:T.greenDark, padding:'40px 24px', textAlign:'center'}}>
        <SectionTitle color={T.gold}><span style={{color:T.goldLight}}>To'y marosimigacha</span></SectionTitle>
        <Countdown date={d.date||'2026-06-15'}
          style={{marginTop:8}}
          itemStyle={{background:'rgba(196,168,85,0.1)', borderColor:'rgba(196,168,85,0.25)', width:65, height:65}}
          numStyle={{color:T.gold, fontSize:22}}
          lblStyle={{color:T.goldLight}}
        />
      </div>

      {/* Wave transition */}
      <WaveDivider color={T.greenDark} bg={T.cream}/>

      {/* ============ OYAT — Krem fon + gullar ============ */}
      <Reveal style={{padding:'40px 24px 50px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.goldDim} size={140}/>
        <FloralCorner position='bottom-left' color={T.goldDim} size={140}/>
        <div style={{fontFamily:"'Traditional Arabic','Times New Roman',serif", fontSize:22, color:T.goldDim, marginBottom:14, lineHeight:1.6}}>
          وَجَعَلْنَا بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </div>
        <p style={{fontSize:15, fontStyle:'italic', lineHeight:1.75, color:T.textMuted, maxWidth:340, margin:'0 auto'}}>
          {d.mainText||'"Biz sizlar orasida muhabbat va rahm-shafqatni vujudga keltirdik."\n(Ar-Rum 21)'}
        </p>
      </Reveal>

      {/* ============ MAROSIM SANASI — Oq + gul ============ */}
      <Reveal style={{padding:'50px 20px', background:T.creamLight, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='top-right' color={T.goldDim} size={110}/>
        <FloralCorner position='top-left' color={T.goldDim} size={110}/>
        <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Marosim sanasi</span></SectionTitle>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.green} textColor={T.textDark} />
      </Reveal>

      {/* Wave transition */}
      <WaveDivider color={T.creamLight} bg={T.greenDark}/>

      {/* ============ LOKATSIYA — Yashil fon ============ */}
      {d.address && (
        <div ref={locRef} style={{padding:'50px 20px', textAlign:'center', background:T.greenDark, color:T.textLight}}>
          <SectionTitle color={T.gold}><span style={{color:T.goldLight}}>Lokatsiya</span></SectionTitle>
          <div style={{opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <div style={{marginBottom:12}}><LocationPin size={40} color={T.goldLight}/></div>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* Wave transition */}
      {d.address && <WaveDivider color={T.greenDark} bg={T.cream}/>}

      {/* ============ SOVG'A — Krem + gul ============ */}
      {d.cardNumber && (
        <div ref={giftRef} style={{padding:'50px 20px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='bottom-right' color={T.goldDim} size={130}/>
          <FloralCorner position='bottom-left' color={T.goldDim} size={130}/>
          <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Sovg'a</span></SectionTitle>
          <div style={{opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <p style={{fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 20px'}}>
              Sizning samimiy tilaklaringiz biz uchun eng katta sovg'a. Agar xohlasangiz, karta orqali tabrik yo'llashingiz mumkin.
            </p>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} cardType="HUMO" accentFrom={T.greenDark} accentTo={T.green} />
          </div>
        </div>
      )}

      {/* ============ RSVP — Yashil fon ============ */}
      <div style={{background:T.greenDark}}>
        <WaveDivider color={d.cardNumber ? T.cream : T.creamLight} bg={T.greenDark}/>
      </div>
      <Reveal style={{padding:'30px 24px 40px', textAlign:'center', background:T.greenDark}}>
        <SectionTitle color={T.gold}><span style={{color:T.goldLight}}>Taklifni tasdiqlang</span></SectionTitle>
        <div style={{fontSize:14, color:T.goldLight, opacity:.6, marginBottom:20}}>Ishtirokingiz biz uchun muhim</div>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.gold} textColor={T.textLight} />
      </Reveal>

      {/* ============ FOOTER ============ */}
      <div style={{padding:'28px 20px', textAlign:'center', background:T.greenDeep}}>
        <GoldOrnament color={T.gold}/>
        <div style={{marginTop:12}}>
          <SwanShape size={40} color="rgba(196,168,85,0.3)"/>
        </div>
        <div style={{fontSize:14, color:T.goldLight, marginTop:8, fontFamily:T.font, letterSpacing:2}}>
          Alloh sizdan rozi bo'lsin ♡
        </div>
        <div style={{fontSize:12, color:'rgba(196,168,85,0.3)', marginTop:6}}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
