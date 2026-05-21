import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

// RANGLAR — namunadan olingan
const T = {
  heroGreen: '#0f2818',
  green: '#1a3c2a',
  greenLight: '#2d5a3f',
  gold: '#c9a84c',
  goldLight: '#dbc476',
  goldDim: '#a08838',
  cream: '#f5f0e4',
  creamDark: '#ede5d3',
  textDark: '#2a2018',
  textMuted: '#5a5040',
  textLight: '#f0ead6',
  font: "'Playfair Display',serif",
  body: "'Cormorant Garamond',serif",
};


// Gul bezak — pastki qismlarda ishlatiladi
const FloralCorner = ({position='bottom-right', color='#c9a84c', size=120}) => {
  const flip = position.includes('left') ? 'scaleX(-1)' : 'scaleX(1)';
  const isTop = position.includes('top');
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" 
      style={{position:'absolute', [isTop?'top':'bottom']:0, [position.includes('left')?'left':'right']:0, transform:flip+(isTop?' scaleY(-1)':''), opacity:.15, pointerEvents:'none'}}>
      <path d="M120 120 C100 100 80 110 60 105 C40 100 30 80 35 60 C40 40 55 30 70 35 C85 40 90 55 85 70" stroke={color} strokeWidth="1.2" fill="none"/>
      <circle cx="85" cy="70" r="8" fill={color} opacity=".2"/>
      <circle cx="70" cy="35" r="6" fill={color} opacity=".15"/>
      <circle cx="35" cy="60" r="7" fill={color} opacity=".18"/>
      <path d="M85 70 C95 65 105 70 110 80" stroke={color} strokeWidth="0.8" fill="none"/>
      <path d="M85 70 C80 80 85 95 95 100" stroke={color} strokeWidth="0.8" fill="none"/>
      <circle cx="110" cy="80" r="4" fill={color} opacity=".12"/>
      <circle cx="95" cy="100" r="5" fill={color} opacity=".14"/>
      <path d="M60 105 C50 110 40 115 25 115" stroke={color} strokeWidth="0.6" fill="none"/>
      <circle cx="25" cy="115" r="3" fill={color} opacity=".1"/>
      <ellipse cx="85" cy="70" rx="12" ry="8" fill={color} opacity=".08" transform="rotate(-20 85 70)"/>
      <ellipse cx="70" cy="35" rx="10" ry="6" fill={color} opacity=".06" transform="rotate(30 70 35)"/>
      <path d="M35 60 C20 50 10 55 5 70" stroke={color} strokeWidth="0.6" fill="none"/>
      <path d="M35 60 C25 70 20 85 25 100" stroke={color} strokeWidth="0.6" fill="none"/>
    </svg>
  );
};

const FloralDivider = ({color='#c9a84c'}) => (
  <svg width="240" height="40" viewBox="0 0 240 40" fill="none" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="20" x2="80" y2="20" stroke={color} strokeWidth="0.4" opacity=".3"/>
    <circle cx="90" cy="20" r="3" fill={color} opacity=".2"/>
    <path d="M105 12 C110 8 118 8 120 14 C122 8 130 8 135 12 C140 18 120 30 120 30 C120 30 100 18 105 12Z" fill={color} opacity=".25"/>
    <circle cx="150" cy="20" r="3" fill={color} opacity=".2"/>
    <line x1="160" y1="20" x2="240" y2="20" stroke={color} strokeWidth="0.4" opacity=".3"/>
  </svg>
);

// ========== ISLOMIY SVG BEZAKLAR ==========
const Bismillah = ({color='#c9a84c'}) => (
  <svg width="200" height="50" viewBox="0 0 200 50" style={{display:'block',margin:'0 auto'}}>
    <text x="100" y="32" textAnchor="middle" fontFamily="'Traditional Arabic','Times New Roman',serif" fontSize="32" fill={color} opacity=".9">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</text>
  </svg>
);

const GoldOrnament = ({color='#c9a84c'}) => (
  <svg width="160" height="20" viewBox="0 0 160 20" style={{display:'block',margin:'0 auto'}}>
    <line x1="0" y1="10" x2="55" y2="10" stroke={color} strokeWidth="0.5" opacity=".4"/>
    <path d="M70 10 L75 4 L80 10 L75 16Z" fill={color} opacity=".5"/>
    <circle cx="80" cy="10" r="2" fill={color} opacity=".6"/>
    <path d="M80 10 L85 4 L90 10 L85 16Z" fill={color} opacity=".5"/>
    <line x1="105" y1="10" x2="160" y2="10" stroke={color} strokeWidth="0.5" opacity=".4"/>
  </svg>
);

const SectionTitle = ({children, color='#c9a84c'}) => (
  <div style={{textAlign:'center', marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
      <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,1 12,7 19,7 14,11 16,18 10,14 4,18 6,11 1,7 8,7" fill={color} opacity=".5"/></svg>
      <span style={{fontFamily:T.font, fontSize:13, letterSpacing:4, textTransform:'uppercase', fontWeight:600}}>{children}</span>
      <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,1 12,7 19,7 14,11 16,18 10,14 4,18 6,11 1,7 8,7" fill={color} opacity=".5"/></svg>
    </div>
  </div>
);

const LocationPin = ({size=44, color='#1a3c2a'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:'block',margin:'0 auto'}}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity=".15"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={color}/>
  </svg>
);

const GiftIcon = ({size=44, color='#1a3c2a'}) => (
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
        @keyframes lanternGlow{0%,100%{filter:brightness(1) drop-shadow(0 0 8px rgba(201,168,76,0.3))}50%{filter:brightness(1.2) drop-shadow(0 0 16px rgba(201,168,76,0.6))}}
      `}</style>

      {/* ============ HERO — Islomiy masjid rasmli ============ */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 24px',
        background:`linear-gradient(180deg, rgba(15,40,24,0.5) 0%, rgba(26,60,42,0.75) 50%, rgba(15,40,24,0.92) 100%), url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80') center top/cover`,
        color:T.textLight, overflow:'hidden',
      }}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:`linear-gradient(transparent,${T.green})`}}/>

        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.4s ease', position:'relative', zIndex:1 }}>
          {/* Bismillah */}
          <Bismillah color={T.goldLight}/>
          <div style={{fontSize:11, letterSpacing:5, textTransform:'uppercase', color:T.gold, marginTop:12, marginBottom:24}}>Bismillahir Rahmanir Rahim</div>

          {/* Ismlar */}
          <div style={{fontFamily:T.font, fontSize:44, fontWeight:700, letterSpacing:3, lineHeight:1.1, textShadow:'0 2px 20px rgba(0,0,0,0.4)'}}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{fontFamily:T.font, fontSize:32, color:T.gold, margin:'4px 0', fontStyle:'italic'}}>&</div>
          <div style={{fontFamily:T.font, fontSize:44, fontWeight:700, letterSpacing:3, lineHeight:1.1, textShadow:'0 2px 20px rgba(0,0,0,0.4)'}}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>

          <div style={{margin:'20px 0'}}>
            <GoldOrnament color={T.goldLight}/>
          </div>
          <div style={{fontSize:15, color:T.goldLight, letterSpacing:2, textTransform:'uppercase'}}>Nikoh oqshomiga taklif qilamiz</div>

          {/* Chiroq emoji o'rniga gold dot */}
          <div style={{display:'flex',justifyContent:'center',gap:30,marginTop:10}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:T.gold,opacity:.4}}/>
            <div style={{width:6,height:6,borderRadius:'50%',background:T.gold,opacity:.6}}/>
            <div style={{width:6,height:6,borderRadius:'50%',background:T.gold,opacity:.4}}/>
          </div>
        </div>

        <div style={{position:'absolute',bottom:40,zIndex:2,animation:'bounce 2s infinite'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.gold} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* ============ COUNTDOWN — Yashil fon ============ */}
      <div style={{background:T.green, padding:'40px 24px', textAlign:'center'}}>
        <SectionTitle color={T.gold}><span style={{color:T.goldLight}}>To'y marosimigacha</span></SectionTitle>
        <Countdown date={d.date||'2026-06-15'}
          style={{marginTop:8}}
          itemStyle={{background:'rgba(201,168,76,0.12)', borderColor:'rgba(201,168,76,0.3)', width:65, height:65}}
          numStyle={{color:T.gold, fontSize:22}}
          lblStyle={{color:T.goldLight}}
        />
      </div>

      {/* ============ OYAT — Krem fon + gullar ============ */}
      <Reveal style={{padding:'50px 24px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
        <FloralCorner position='bottom-right' color={T.goldDim} size={140}/>
        <FloralCorner position='bottom-left' color={T.goldDim} size={140}/>
        <div style={{fontFamily:"'Traditional Arabic','Times New Roman',serif", fontSize:22, color:T.goldDim, marginBottom:14, lineHeight:1.6}}>
          وَجَعَلْنَا بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </div>
        <p style={{fontSize:15, fontStyle:'italic', lineHeight:1.75, color:T.textMuted, maxWidth:340, margin:'0 auto'}}>
          {d.mainText||'"Biz sizlar orasida muhabbat va rahm-shafqatni vujudga keltirdik."\n(Ar-Rum 21)'}
        </p>
      </Reveal>

      {/* ============ MAROSIM SANASI — Oq fon ============ */}
      <Reveal style={{padding:'50px 20px', background:'#fff', position:'relative', overflow:'hidden'}}>
        <FloralCorner position='top-right' color={T.goldDim} size={100}/>
        <FloralCorner position='top-left' color={T.goldDim} size={100}/>
        <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Marosim sanasi</span></SectionTitle>
        <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.green} textColor={T.textDark} />
      </Reveal>

      {/* ============ LOKATSIYA — Krem fon ============ */}
      {d.address && (
        <div ref={locRef} style={{padding:'50px 20px', textAlign:'center', background:T.cream, position:'relative', overflow:'hidden'}}>
          <FloralCorner position='top-right' color={T.goldDim} size={110}/>
          <FloralCorner position='top-left' color={T.goldDim} size={110}/>
          <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Lokatsiya</span></SectionTitle>
          <div style={{opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <div style={{marginBottom:12}}><LocationPin size={40} color={T.green}/></div>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* ============ SOVG'A — Oq fon ============ */}
      {d.cardNumber && (
        <div ref={giftRef} style={{padding:'50px 20px', textAlign:'center', background:'#fff', position:'relative', overflow:'hidden'}}>
          <FloralCorner position='bottom-right' color={T.goldDim} size={130}/>
          <FloralCorner position='bottom-left' color={T.goldDim} size={130}/>
          <SectionTitle color={T.goldDim}><span style={{color:T.textDark}}>Sovg'a</span></SectionTitle>
          <div style={{opacity:giftSeen?1:0, transform:giftSeen?'translateY(0)':'translateY(20px)', transition:'all .8s ease'}}>
            <p style={{fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 20px'}}>
              Sizning samimiy tilaklaringiz biz uchun eng katta sovg'a. Agar xohlasangiz, karta orqali tabrik yo'llashingiz mumkin.
            </p>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} cardType="HUMO" accentFrom={T.green} accentTo={T.greenLight} />
          </div>
        </div>
      )}

      {/* ============ RSVP — Yashil fon ============ */}
      <Reveal style={{padding:'50px 24px 40px', textAlign:'center', background:T.green}}>
        <SectionTitle color={T.gold}><span style={{color:T.goldLight}}>Taklifni tasdiqlang</span></SectionTitle>
        <div style={{fontSize:14, color:T.goldLight, opacity:.7, marginBottom:20}}>Ishtirokingiz biz uchun muhim</div>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.gold} accentBg={T.green} textColor={T.textLight} />
      </Reveal>

      {/* ============ FOOTER ============ */}
      <div style={{background:T.green, padding:'16px 0'}}><FloralDivider color={T.gold}/></div>
      <div style={{padding:'28px 20px', textAlign:'center', background:T.heroGreen}}>
        <GoldOrnament color={T.gold}/>
        <div style={{fontSize:14, color:T.goldLight, marginTop:12, fontFamily:T.font, letterSpacing:2}}>
          Alloh sizdan rozi bo'lsin
        </div>
        <div style={{fontSize:12, color:'rgba(201,168,76,0.4)', marginTop:8}}>
          {d.groomName} & {d.brideName}
        </div>
      </div>
    </div>
  );
}
