import { useState, useEffect } from 'react';
import useOnScreen from './useOnScreen';
import { Reveal, Countdown, MapButtons, RsvpForm, sharedKeyframes } from './TemplateShared';

export default function EventPro({ data, invitation, onRespond, sent }) {
  const d = data || {};
  const [heroOn, setHero] = useState(false);
  const [locRef, locSeen] = useOnScreen();
  const eventName = d.eventName || 'Tadbir';
  const eventDate = d.time || '2026-06-15';
  const F = "'Playfair Display',serif";
  const B = "'Cormorant Garamond',serif";
  const accent = '#2563eb';

  useEffect(() => { setTimeout(() => setHero(true), 300); }, []);

  return (
    <div style={{ fontFamily: B, color: '#1e293b', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        ${sharedKeyframes}
      `}</style>

      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
        color: '#fff',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(transparent, #f8fafc)' }} />
        <div style={{ opacity: heroOn ? 1 : 0, transform: heroOn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎤</div>
          <div style={{ fontSize: 11, letterSpacing: 6, textTransform: 'uppercase', opacity: .6, marginBottom: 16 }}>Taklif</div>
          <div style={{ fontFamily: F, fontSize: 32, fontWeight: 700, letterSpacing: 1, lineHeight: 1.2, maxWidth: 320 }}>
            {eventName}
          </div>
          <div style={{ width: 50, height: 2, background: accent, margin: '20px auto', borderRadius: 1 }} />
          <div style={{ fontSize: 15, opacity: .7, fontStyle: 'italic', maxWidth: 300 }}>
            {d.eventDesc ? d.eventDesc.slice(0, 80) + (d.eventDesc.length > 80 ? '...' : '') : 'Sizni tadbirimizga taklif etamiz'}
          </div>
          <Countdown date={eventDate} style={{ marginTop: 28, position: 'relative', zIndex: 1 }}
            itemStyle={{ background: 'rgba(37,99,235,0.2)', borderColor: 'rgba(37,99,235,0.3)' }}
            numStyle={{ color: '#93c5fd' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, zIndex: 2, animation: 'bounce 2s infinite' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* ABOUT EVENT */}
      <Reveal style={{ padding: '56px 24px', textAlign: 'center', background: '#f8fafc' }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>📋</div>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>Tadbir haqida</h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: '#475569', maxWidth: 340, margin: '0 auto' }}>
          {d.eventDesc || 'Tadbirimiz haqida batafsil ma\'lumot.'}
        </p>
      </Reveal>

      {/* DATE & TIME */}
      <Reveal style={{ padding: '40px 24px', textAlign: 'center', background: '#f8fafc' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 340, margin: '0 auto', boxShadow: '0 4px 30px rgba(0,0,0,0.05)', display: 'flex', gap: 20, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>📅</div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Sana</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: accent, marginTop: 4 }}>{eventDate}</div>
          </div>
          {d.address && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>📍</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Joylashuv</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginTop: 4, maxWidth: 140 }}>{d.address.slice(0, 40)}</div>
            </div>
          )}
        </div>
      </Reveal>

      {/* LOCATION */}
      {d.address && (
        <div ref={locRef} style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc' }}>
          <div style={{ opacity: locSeen ? 1 : 0, transform: locSeen ? 'translateY(0)' : 'translateY(30px)', transition: 'all .8s ease' }}>
            <MapButtons address={d.address} venueName={d.venueName} googleMapsUrl={d.googleMapsUrl} yandexMapsUrl={d.yandexMapsUrl} />
          </div>
        </div>
      )}

      {/* EXTRA INFO */}
      {d.eventExtra && (
        <Reveal style={{ padding: '40px 24px', textAlign: 'center', background: '#f8fafc' }}>
          <div style={{ background: '#eff6ff', borderRadius: 16, padding: 20, maxWidth: 340, margin: '0 auto', borderLeft: `4px solid ${accent}` }}>
            <div style={{ fontSize: 13, color: accent, fontWeight: 600, marginBottom: 6 }}>ℹ️ Qo'shimcha ma'lumot</div>
            <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{d.eventExtra}</div>
          </div>
        </Reveal>
      )}

      {/* RSVP */}
      <Reveal style={{ padding: '50px 24px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #f8fafc, #e2e8f0)' }}>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 600, marginBottom: 20 }}>Qatnashasizmi?</h2>
        <RsvpForm onRespond={onRespond} sent={sent} accentColor={accent} textColor="#1e293b" />
      </Reveal>

      <div style={{ padding: '28px 20px', textAlign: 'center', background: '#e2e8f0', fontSize: 13, color: '#94a3b8' }}>
        © {new Date().getFullYear()} {eventName}
      </div>
    </div>
  );
}
