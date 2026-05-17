import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';

// ==================== REVEAL WRAPPER ====================
export function Reveal({ children, className = '', style = {}, delay = 0 }) {
  const [ref, seen] = useOnScreen();
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: seen ? 1 : 0,
      transform: seen ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
    }}>{children}</div>
  );
}

// ==================== COUNTDOWN ====================
function getCD(ds) {
  const t = new Date(ds) - new Date();
  if (t <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return { d: Math.floor(t / 864e5), h: Math.floor(t % 864e5 / 36e5), m: Math.floor(t % 36e5 / 6e4), s: Math.floor(t % 6e4 / 1e3) };
}

export function Countdown({ date, style = {}, itemStyle = {}, numStyle = {}, lblStyle = {} }) {
  const [cd, setCd] = useState(getCD(date));
  useEffect(() => { const iv = setInterval(() => setCd(getCD(date)), 1000); return () => clearInterval(iv); }, [date]);
  const items = [
    { v: cd.d, l: 'Kun' }, { v: cd.h, l: 'Soat' },
    { v: cd.m, l: 'Daqiqa' }, { v: cd.s, l: 'Soniya' },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', ...style }}>
      {items.map((c, i) => (
        <div key={i} style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: `cdPop .6s ease ${i * 120}ms both`,
          ...itemStyle,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, ...numStyle }}>{String(c.v).padStart(2, '0')}</div>
          <div style={{ fontSize: 9, opacity: .7, marginTop: 2, textTransform: 'uppercase', letterSpacing: .5, ...lblStyle }}>{c.l}</div>
        </div>
      ))}
    </div>
  );
}

// ==================== CALENDAR ====================
const MONTHS = ['', 'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const WDAYS = ['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha', 'Ya'];
const DAYNAMES = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export function Calendar({ date, time, accentColor = '#d4a574', textColor = '#3a3a3a' }) {
  const dt = new Date(date);
  const y = dt.getFullYear(), mo = dt.getMonth(), dy = dt.getDate();
  const firstDay = (new Date(y, mo, 1).getDay() + 6) % 7;
  const dim = new Date(y, mo + 1, 0).getDate();
  const weeks = [];
  let w = Array(firstDay).fill(null);
  for (let i = 1; i <= dim; i++) { w.push(i); if (w.length === 7) { weeks.push(w); w = []; } }
  if (w.length) { while (w.length < 7) w.push(null); weeks.push(w); }
  const dow = DAYNAMES[dt.getDay()];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '26px 18px', maxWidth: 340, margin: '0 auto', boxShadow: '0 4px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22 }}>{MONTHS[mo + 1]} {y}</div>
        <div style={{ width: 36, height: 3, background: accentColor, borderRadius: 2, margin: '8px auto 14px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {WDAYS.map(d => <div key={d} style={{ fontSize: 12, fontWeight: 600, color: '#aaa', padding: '6px 0' }}>{d}</div>)}
          {weeks.flat().map((d, i) => (
            <div key={i} style={{
              fontSize: 14, padding: '8px 0', borderRadius: '50%', position: 'relative',
              background: d === dy ? accentColor : 'transparent',
              color: d === dy ? '#fff' : textColor,
              fontWeight: d === dy ? 700 : 400,
              visibility: d == null ? 'hidden' : 'visible',
            }}>
              {d}
              {d === dy && <span style={{ position: 'absolute', top: -5, right: -1, fontSize: 9 }}>❤</span>}
            </div>
          ))}
        </div>
      </div>
      {time && <div style={{ fontSize: 19, marginTop: 22, color: textColor }}>
        {dow} kuni, <b style={{ color: accentColor, fontWeight: 600 }}>{time}</b> da
      </div>}
    </div>
  );
}

// ==================== MAP BUTTONS ====================
export function MapButtons({ address, venueName, googleMapsUrl, yandexMapsUrl }) {
  if (!address) return null;
  const gUrl = googleMapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
  const btnBase = { display: 'block', width: '100%', padding: 14, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'pointer', marginBottom: 8, textDecoration: 'none', textAlign: 'center', fontFamily: "'Cormorant Garamond',serif" };
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 24, maxWidth: 340, margin: '0 auto', boxShadow: '0 4px 30px rgba(0,0,0,0.05)' }}>
      {venueName && <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: '#c0392b', fontWeight: 600, marginBottom: 8 }}>"{venueName}"</div>}
      <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 16 }}>{address}</div>
      <a href={gUrl} target="_blank" rel="noopener" style={{ ...btnBase, background: '#4285f4' }}>📍 Google Maps'da ochish</a>
      {yandexMapsUrl && <a href={yandexMapsUrl} target="_blank" rel="noopener" style={{ ...btnBase, background: '#e74c3c' }}>📍 Yandex Maps'da ochish</a>}
    </div>
  );
}

// ==================== BANK CARD ====================
export function BankCard({ cardNumber, ownerName, cardType = 'HUMO', accentFrom = '#d4a574', accentTo = '#b8863a' }) {
  const [copied, setCopied] = useState(false);
  if (!cardNumber) return null;
  const fmt = cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  const copy = () => { navigator.clipboard?.writeText(cardNumber.replace(/\s/g, '')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
        borderRadius: 16, padding: 22, maxWidth: 320, margin: '0 auto', color: '#fff',
        boxShadow: `0 8px 32px ${accentFrom}55`, position: 'relative', overflow: 'hidden', textAlign: 'left',
      }}>
        <div style={{ width: 34, height: 26, background: '#e6b84d', borderRadius: 5, marginBottom: 14 }} />
        <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 13, fontWeight: 600, opacity: .8, letterSpacing: 1 }}>{cardType}</div>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 19, letterSpacing: 2.5, marginBottom: 14 }}>{fmt}</div>
        <div style={{ fontSize: 9, opacity: .5, textTransform: 'uppercase', letterSpacing: 1 }}>Karta egasi</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, marginTop: 2 }}>{(ownerName || '').toUpperCase()}</div>
        <div style={{ position: 'absolute', bottom: 18, right: 18, width: 32, height: 32, border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
      </div>
      <button onClick={copy} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', maxWidth: 320, margin: '14px auto 0', padding: 14,
        background: '#fff', border: '1.5px solid #e0d5c7', borderRadius: 12,
        fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', color: '#3a3a3a',
      }}>{copied ? '✅ Nusxalandi!' : '📋 Karta raqamini nusxalash'}</button>
    </div>
  );
}

// ==================== RSVP FORM ====================
export function RsvpForm({ invitationId, onRespond, sent, showRsvp = true, accentColor = '#d4a574', accentBg = '#f5efe6', textColor = '#3a3a3a' }) {
  const [rsvp, setRsvp] = useState('');
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');

  const submit = () => { if (onRespond) onRespond({ rsvp: rsvp || null, guestCount: guests, message: msg, senderName: name }); };

  const inp = { width: '100%', maxWidth: 320, padding: '14px 16px', border: '1.5px solid #e0d5c7', borderRadius: 12, fontFamily: "'Cormorant Garamond',serif", fontSize: 15, outline: 'none', background: '#fff', margin: '0 auto 10px', display: 'block', color: textColor };

  if (sent) return <div style={{ padding: 30, fontSize: 18, color: accentColor, fontWeight: 600, textAlign: 'center' }}>✅ Javobingiz qabul qilindi! Rahmat!</div>;

  return (
    <div style={{ textAlign: 'center' }}>
      <input style={inp} placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
      {showRsvp && (<>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          {[{ k: 'attending', l: '✅ Kelaman' }, { k: 'notAttending', l: '❌ Kela olmayman' }, { k: 'maybe', l: '🤔 Bilmayman' }].map(o => (
            <button key={o.k} onClick={() => setRsvp(o.k)} style={{
              padding: '10px 16px', borderRadius: 10, fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${rsvp === o.k ? accentColor : '#e0d5c7'}`,
              background: rsvp === o.k ? accentColor : '#fff',
              color: rsvp === o.k ? '#fff' : textColor,
              transition: 'all .2s',
            }}>{o.l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, fontSize: 14 }}>
          <span>Mehmonlar soni:</span>
          <input type="number" min="1" max="20" value={guests} onChange={e => setGuests(+e.target.value)} style={{ width: 54, textAlign: 'center', padding: 10, border: '1.5px solid #e0d5c7', borderRadius: 10, fontFamily: "'Cormorant Garamond',serif", fontSize: 15, outline: 'none' }} />
        </div>
      </>)}
      <textarea placeholder="Tabrik so'zlaringiz..." value={msg} onChange={e => setMsg(e.target.value)} style={{ ...inp, minHeight: 80, resize: 'none' }} />
      <button onClick={submit} style={{
        width: '100%', maxWidth: 320, padding: 16, border: 'none', borderRadius: 12,
        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
        color: '#fff', fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600,
        cursor: 'pointer', letterSpacing: 1, boxShadow: `0 4px 20px ${accentColor}55`, marginTop: 4,
      }}>✈️ Yuborish</button>
    </div>
  );
}

// ==================== SHARED CSS (keyframes) ====================
export const sharedKeyframes = `
@keyframes cdPop { from { opacity:0; transform:scale(.5) } to { opacity:1; transform:scale(1) } }
@keyframes bounce { 0%,100% { transform:translateY(0) } 50% { transform:translateY(10px) } }
@keyframes pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.15) } }
@keyframes fadeSlideUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
`;
