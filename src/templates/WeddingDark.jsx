import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, Calendar, MapButtons, BankCard, RsvpForm, sharedKeyframes } from './TemplateShared';

const T = {
  heroImg: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  heroOverlay: 'linear-gradient(180deg,rgba(10,10,20,0.4),rgba(10,10,30,0.85))',
  bgColor: '#0f0f1a',
  bgCard: '#1a1a2e',
  accent: '#c9a96e',
  accentDark: '#a07d3a',
  textDark: '#e0d5c0',
  textMuted: '#8a8098',
  textLight: '#f0ead6',
  fontDisplay: "'Playfair Display',serif",
  fontBody: "'Cormorant Garamond',serif",
};

export default function WeddingDark({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const [giftRef, giftSeen] = useOnScreen();

  useEffect(() => { setTimeout(() => setHero(true), 400); }, []);

  const secStyle = { padding:'56px 24px', textAlign:'center', background:T.bgColor };

  return (
    <div style={{ fontFamily:T.fontBody, color:T.textDark, overflowX:'hidden', background:T.bgColor }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
      `}</style>

      {/* HERO */}
      <div style={{
        position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 20px',
        background:`${T.heroOverlay},url('${T.heroImg}') center/cover`, color:T.textLight,
      }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120, background:`linear-gradient(transparent,${T.bgColor})` }}/>
        <div style={{ opacity:heroOn?1:0, transform:heroOn?'translateY(0)':'translateY(30px)', transition:'all 1.4s ease' }}>
          <div style={{ width:50, height:1, background:T.accent, margin:'0 auto 20px', opacity:.6 }}/>
          <div style={{ fontSize:11, letterSpacing:8, textTransform:'uppercase', color:T.accent, marginBottom:24 }}>To'y taklifi</div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:42, fontWeight:700, letterSpacing:4, color:T.textLight, lineHeight:1.1 }}>
            {(d.groomName||'KUYOV').toUpperCase()}
          </div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:28, color:T.accent, fontStyle:'italic', margin:'6px 0' }}>&</div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:42, fontWeight:700, letterSpacing:4, color:T.textLight, lineHeight:1.1 }}>
            {(d.brideName||'KELIN').toUpperCase()}
          </div>
          <div style={{ width:50, height:1, background:T.accent, margin:'24px auto 16px', opacity:.6 }}/>
          <div style={{ fontSize:16, fontStyle:'italic', opacity:.7, letterSpacing:1 }}>Baxt to'yimizga taklif etamiz</div>
          <Countdown date={d.date||'2026-06-15'} style={{ marginTop:28, position:'relative', zIndex:1 }}
            itemStyle={{ background:'rgba(201,169,110,0.15)', borderColor:'rgba(201,169,110,0.3)' }}
            numStyle={{ color:T.accent }} />
        </div>
        <div style={{ position:'absolute', bottom:40, zIndex:2, animation:'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* LOVE LETTER */}
      <Reveal style={secStyle}>
        <div style={{ fontSize:32, marginBottom:14, display:'inline-block', animation:'pulse 2s ease-in-out infinite', filter:'grayscale(0.3)' }}>✨</div>
        <h2 style={{ fontFamily:T.fontDisplay, fontSize:28, fontWeight:600, color:T.textLight, marginBottom:16 }}>Qalblarimiz birlashgan kunda...</h2>
        <p style={{ fontSize:16, fontStyle:'italic', lineHeight:1.75, color:T.textMuted, maxWidth:340, margin:'0 auto' }}>
          {d.mainText||`"Hayotimizning eng yorqin sahifasi boshlanayotgan kunda, sizni yonimizda ko'rishni istaymiz. Sizning ishtirokingiz bu kunni yanada unutilmas qiladi."`}
        </p>
      </Reveal>

      {/* CALENDAR */}
      <Reveal style={{ padding:'50px 20px', background:T.bgColor }}>
        <div style={{ background:T.bgCard, borderRadius:20, padding:'26px 18px', maxWidth:340, margin:'0 auto', boxShadow:'0 4px 30px rgba(0,0,0,0.3)' }}>
          <Calendar date={d.date||'2026-06-15'} time={d.time||'18:00'} accentColor={T.accent} textColor={T.textDark} />
        </div>
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding:'50px 20px', textAlign:'center', background:T.bgColor }}>
          <div style={{ fontSize:36, color:T.accent, marginBottom:10, opacity:locSeen?1:0, transform:locSeen?'scale(1)':'scale(0.5)', transition:'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>📍</div>
          <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, color:T.textLight, marginBottom:20, opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(20px)', transition:'all .6s ease .15s' }}>To'yxona manzili</h2>
          <div style={{ opacity:locSeen?1:0, transform:locSeen?'translateY(0)':'translateY(30px)', transition:'all .8s ease .25s' }}>
            <div style={{ background:T.bgCard, borderRadius:20, padding:24, maxWidth:340, margin:'0 auto', boxShadow:'0 4px 30px rgba(0,0,0,0.3)' }}>
              {d.venueName && <div style={{ fontFamily:T.fontDisplay, fontSize:19, color:T.accent, fontWeight:600, marginBottom:8 }}>"{d.venueName}"</div>}
              <div style={{ fontSize:14, color:T.textMuted, lineHeight:1.5, marginBottom:16 }}>{d.address}</div>
              <a href={d.googleMapsUrl||`https://www.google.com/maps/search/${encodeURIComponent(d.address)}`} target="_blank" rel="noopener" style={{ display:'block', width:'100%', padding:14, border:'none', borderRadius:12, fontSize:15, fontWeight:600, color:'#fff', cursor:'pointer', marginBottom:8, textDecoration:'none', textAlign:'center', fontFamily:T.fontBody, background:'#4285f4' }}>📍 Google Maps</a>
              {d.yandexMapsUrl && <a href={d.yandexMapsUrl} target="_blank" rel="noopener" style={{ display:'block', width:'100%', padding:14, border:'none', borderRadius:12, fontSize:15, fontWeight:600, color:'#fff', cursor:'pointer', textDecoration:'none', textAlign:'center', fontFamily:T.fontBody, background:'#e74c3c' }}>📍 Yandex Maps</a>}
            </div>
          </div>
        </div>
      )}

      {/* GIFT CARD */}
      {d.cardNumber && (
        <div ref={giftRef} style={{ padding:'50px 20px', textAlign:'center', background:T.bgColor }}>
          <div style={{ fontSize:36, marginBottom:10, opacity:giftSeen?1:0, transform:giftSeen?'scale(1) rotate(0)':'scale(0.3) rotate(-30deg)', transition:'all .6s cubic-bezier(.175,.885,.32,1.275)' }}>🎁</div>
          <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, color:T.textLight, marginBottom:12, opacity:giftSeen?1:0, transition:'all .6s ease .1s' }}>To'yona va tabriklar</h2>
          <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.6, maxWidth:320, margin:'0 auto 24px', opacity:giftSeen?1:0, transition:'all .6s ease .25s' }}>
            Sizning tilaklaringiz biz uchun qadrli.
          </p>
          <div style={{ opacity:giftSeen?1:0, transform:giftSeen?'perspective(800px) rotateY(0)':'perspective(800px) rotateY(30deg)', transition:'all 1s ease .4s' }}>
            <BankCard cardNumber={d.cardNumber} ownerName={d.groomName} accentFrom={T.accent} accentTo={T.accentDark} />
          </div>
        </div>
      )}

      {/* RSVP */}
      <Reveal style={{ padding:'50px 24px 40px', textAlign:'center', background:`linear-gradient(180deg,${T.bgColor},#0a0a14)` }}>
        <h2 style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:600, color:T.textLight, marginBottom:20 }}>Javobingiz</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={T.accent} textColor={T.textDark} />
      </Reveal>

      <div style={{ padding:'28px 20px', textAlign:'center', background:'#0a0a14', fontSize:13, color:'#4a4060' }}>
        © {new Date().getFullYear()} {d.groomName} & {d.brideName}
      </div>
    </div>
  );
}
