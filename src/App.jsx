import { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { T, catNames } from './lib/i18n';
import * as api from './lib/api';
import { getTemplateComponent } from './templates/templateRegistry';

const AppContext = createContext();
function useApp() { return useContext(AppContext); }

// ==================== ICONS ====================
function TgIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill={color}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;
}

// ==================== UI ICONS (zamonaviy SVG) ====================
function RingIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="7" stroke={color} strokeWidth="1.5"/><path d="M12 7V3M9 4.5h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="14" r="3" stroke={color} strokeWidth="1" opacity=".4"/></svg>;
}
function CakeIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="10" rx="2" stroke={color} strokeWidth="1.5"/><path d="M3 15h18" stroke={color} strokeWidth="1"/><path d="M8 11V9a1 1 0 011-1h0a1 1 0 011 1v2M14 11V9a1 1 0 011-1h0a1 1 0 011 1v2" stroke={color} strokeWidth="1.2"/><path d="M8.5 5.5C8.5 4 9.5 3 9.5 3s1 1 1 2.5M14.5 5.5c0-1.5 1-2.5 1-2.5s1 1 1 2.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity=".6"/></svg>;
}
function PartyIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><path d="M4 21L10 3l4 10 6-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="5" r="2" stroke={color} strokeWidth="1" opacity=".5"/><circle cx="14" cy="3" r="1" fill={color} opacity=".3"/><path d="M2 19l3 2M7 17l1 4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity=".4"/></svg>;
}
function HeartIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill={color} opacity=".85"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
}
function MicIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth="1.5"/><path d="M5 10a7 7 0 0014 0M12 18v3M9 21h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function CopyIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="1.5"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke={color} strokeWidth="1.5"/></svg>;
}
function ShareIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke={color} strokeWidth="1.5"/><circle cx="6" cy="12" r="3" stroke={color} strokeWidth="1.5"/><circle cx="18" cy="19" r="3" stroke={color} strokeWidth="1.5"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth="1.5"/></svg>;
}
function EyeIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/></svg>;
}
function CalendarIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function GiftBoxIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5"/><path d="M12 8v13" stroke={color} strokeWidth="1.5"/><rect x="1" y="5" width="22" height="4" rx="1.5" stroke={color} strokeWidth="1.5"/><path d="M12 5c0 0-2-4-5-4s-3 3 0 4h5zM12 5c0 0 2-4 5-4s3 3 0 4h-5z" stroke={color} strokeWidth="1.2"/></svg>;
}
function WalletIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5"/><path d="M2 10h20" stroke={color} strokeWidth="1.5"/><circle cx="17" cy="14" r="1.5" fill={color}/></svg>;
}
function ChartIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.5"/><rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5"/><rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.5"/></svg>;
}
function SparkleIcon({size=18,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill={color}><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" opacity=".8"/></svg>;
}
function MessageIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="1.5"/></svg>;
}
function UsersIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.5"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7" stroke={color} strokeWidth="1.5"/><circle cx="17" cy="8" r="3" stroke={color} strokeWidth="1.2" opacity=".5"/><path d="M18 14c3 .5 5 3 5 7" stroke={color} strokeWidth="1.2" opacity=".5"/></svg>;
}
function MailIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5"/><path d="M2 7l10 7 10-7" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
function CheckIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function IgIcon({size=16,color='currentColor'}) {
  return <svg style={{width:size,height:size,verticalAlign:'middle',flexShrink:0}} viewBox="0 0 24 24" fill={color}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
}


export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('tkn_lang') || 'uz');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = T[lang];
  const navigate = useNavigate();

  useEffect(() => { localStorage.setItem('tkn_lang', lang); }, [lang]);
  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getMe().then(d => setUser(d.user)).catch(() => {}).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const toggleLang = () => setLang(l => l === 'uz' ? 'ru' : 'uz');
  const logout = () => { api.logout(); setUser(null); navigate('/'); };
  const ctx = { t, lang, user, setUser, navigate, logout, loading };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app"><main>
        <Header toggleLang={toggleLang} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates/:cat" element={<TemplatesPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create/:cat/:tplId" element={<FormPage />} />
          <Route path="/share/:uid" element={<SharePage />} />
          <Route path="/v/:slug" element={<ViewInvPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/inv/:id" element={<ProfileInvPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main><BottomNav />
      </div>
    </AppContext.Provider>
  );
}

// ==================== BOTTOM NAVIGATION ====================
function BottomNav() {
  const { lang, navigate } = useApp();
  const path = window.location.pathname;
  // /v/ sahifalarida ko'rsatmaslik
  if (path.startsWith('/v/')) return null;

  const items = [
    { key:'/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, label: lang==='uz'?'Asosiy':'Главная' },
    { key:'/profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>, label: lang==='uz'?'Profil':'Профиль' },
    { key:'/stats', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>, label: lang==='uz'?'Statistika':'Статистика' },
    { key:'/faq', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.12 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>, label: lang==='uz'?'Savollar':'Вопросы' },
  ];

  return (
    <div className="bottom-nav">
      {items.map(it => (
        <button key={it.key} className={`nav-item ${path===it.key?'active':''}`} aria-label={it.label} onClick={() => navigate(it.key)}>
          {it.icon}
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ==================== STATS PAGE ====================
function StatsPage() {
  const { lang } = useApp();
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch('/api/templates').then(r=>r.json()).then(d => {
      const tplCount = d.templates?.length || 0;
      fetch('/api/health').then(r=>r.json()).then(h => {
        setStats({ templates: tplCount, uptime: h.uptime || '?' });
      });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}><ChartIcon size={20} color='var(--purple)'/> {lang==='uz'?'Statistika':'Статистика'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { i: '🎨', v: stats?.templates || '...', l: lang==='uz'?'Shablonlar':'Шаблоны' },
          { i: '🌐', v: stats?.uptime || '...', l: lang==='uz'?'Server uptime':'Аптайм' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--white)', borderRadius:14, padding:20, textAlign:'center', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{s.i}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'var(--purple)' }}>{s.v}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:20, padding:16, background:'var(--white)', borderRadius:14, border:'1px solid var(--border)' }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>ℹ️ {lang==='uz'?'Platforma haqida':'О платформе'}</div>
        <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
          {lang==='uz'
            ? "Taklifnomachi.online — O'zbekistonda birinchi raqamli taklifnomalar platformasi. To'y, tug'ilgan kun, tadbir va dil izhorlari uchun zamonaviy taklifnomalar yarating."
            : 'Taklifnomachi.online — первая платформа цифровых приглашений в Узбекистане.'}
        </div>
      </div>
    </div>
  );
}

// ==================== FAQ PAGE ====================
function FaqPage() {
  const { lang } = useApp();
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = lang==='uz' ? [
    { q: "Taklifnoma qanday tayyorlanadi?", a: "1. Shablon tanlaysiz\n2. Ma'lumotlarni kiritasiz (ism, sana, manzil)\n3. Link olasiz va do'stlaringizga yuborasiz\n4. Mehmonlar javob yuboradi — siz profildan ko'rasiz" },
    { q: "Qanday to'lov qilaman?", a: "Premium shablon tanlaganda 6 raqamli kod beriladi. Shu kodni @Taklifnomachi_online_bot ga yuboring, ko'rsatilgan kartaga to'lov qiling va screenshot yuboring. Admin tasdiqlaydi — link tayyor!" },
    { q: "Agar to'lovim tasdiqlanmasa kimga bog'lanay?", a: "Admin bilan bog'laning: @ndd_admin\nYoki qo'llab-quvvatlash botimiz orqali: @Taklifnomachi_online_bot" },
    { q: "Maxsus taklifnoma buyurtmasi nima?", a: "Bu shaxsiy talablaringiz asosida alohida domen va profillik sayt orqali yaratilgan maxsus taklifnoma. Narxi 159,000 so'mdan boshlanadi. Buyurtma uchun @ndd_admin ga murojaat qiling." },
  ] : [
    { q: "Как создать приглашение?", a: "1. Выберите шаблон\n2. Заполните данные\n3. Получите ссылку\n4. Отправьте гостям" },
    { q: "Как оплатить?", a: "При выборе премиум шаблона вы получите 6-значный код. Отправьте его боту @Taklifnomachi_online_bot, оплатите и отправьте скриншот." },
    { q: "Если оплата не подтверждена?", a: "Свяжитесь с админом: @ndd_admin\nИли через бот поддержки: @Taklifnomachi_online_bot" },
    { q: "Что такое индивидуальное приглашение?", a: "Персональный сайт-приглашение на отдельном домене. От 159,000 сум. Обратитесь к @ndd_admin." },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ fontSize: 20, fontWeight: 700, padding: '0 20px', marginBottom: 16 }}>❓ {lang==='uz'?'Ko\'p so\'raladigan savollar':'Часто задаваемые вопросы'}</div>
      {faqs.map((f, i) => (
        <div className="faq-item" key={i}>
          <button className={`faq-q ${openIdx===i?'open':''}`} onClick={() => setOpenIdx(openIdx===i?null:i)}>
            <span>{f.q}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          {openIdx===i && <div className="faq-a" style={{whiteSpace:'pre-line'}}>{f.a}</div>}
        </div>
      ))}
      <div style={{ padding:'20px', marginTop:16 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>{lang==='uz'?'Qo\'shimcha yordam':'Дополнительная помощь'}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <a href="https://t.me/ndd_admin" target="_blank" rel="noopener" style={{ display:'flex', alignItems:'center', gap:10, padding:12, background:'var(--white)', borderRadius:12, border:'1px solid var(--border)', textDecoration:'none', color:'var(--text)', fontSize:14, fontWeight:500 }}>
            👤 {lang==='uz'?'Admin bilan bog\'lanish':'Связаться с админом'}
          </a>
          <a href="https://t.me/Taklifnomachi_online_bot" target="_blank" rel="noopener" style={{ display:'flex', alignItems:'center', gap:10, padding:12, background:'var(--white)', borderRadius:12, border:'1px solid var(--border)', textDecoration:'none', color:'var(--text)', fontSize:14, fontWeight:500 }}>
             {lang==='uz'?'Qo\'llab-quvvatlash boti':'Бот поддержки'}
          </a>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  const { t } = useApp();
  return <div style={{textAlign:'center',padding:'60px 20px'}}><div style={{fontSize:48,marginBottom:12}}>😔</div><div style={{fontSize:16,fontWeight:600,color:'var(--text2)'}}>Sahifa topilmadi</div><Link to="/" style={{color:'var(--purple)',fontSize:14,marginTop:12,display:'inline-block'}}>← Bosh sahifa</Link></div>;
}

// ==================== HEADER ====================
function Header({ toggleLang }) {
  const { t, user, navigate } = useApp();
  return (
    <div className="hdr">
      <div className="hdr-left">
        <Link to="/" className="hdr-logo">
          <div className="hdr-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" stroke="#fff" strokeWidth="1.5"/><path d="M3 8l9 5 9-5M12 13v8" stroke="#fff" strokeWidth="1.5"/></svg>
          </div>
          <div className="hdr-brand">{t.brand}<span>{t.brandDot}</span></div>
        </Link>
      </div>
      <div className="hdr-right">
        <button className="lang-btn" onClick={toggleLang} aria-label="Tilni o'zgartirish">🌐 {t.langCode} ▾</button>
        <button className="icon-btn" aria-label="Profil" onClick={() => navigate(user ? '/profile' : '/auth')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 16c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ==================== SCROLL TO TOP ====================
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className={`scroll-top ${show ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 14V4m0 0L4 9m5-5l5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

// ==================== FOOTER ====================
function Footer() {
  const { t, lang } = useApp();
  return (
    <div className="footer">
      <div className="footer-brand">{t.brand}<span>{t.brandDot}</span></div>
      <div className="footer-desc">{lang === 'uz' ? "To'y, tug'ilgan kun, tadbir va dil izhorlari uchun raqamli taklifnomalar" : 'Цифровые приглашения на свадьбу, день рождения и мероприятия'}</div>
      <div className="footer-social">
        <a href="https://t.me/taklifnomachi_online" target="_blank" rel="noopener" aria-label="Telegram"><TgIcon size={20} color="#0088cc"/></a>
        <a href="https://www.instagram.com/taklifnomachi.online" target="_blank" rel="noopener" aria-label="Instagram"><IgIcon size={20} color="#E4405F"/></a>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Taklifnomachi.online</div>
    </div>
  );
}

// ==================== HOME ====================
function Home() {
  const { t, lang, user, navigate } = useApp();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropOpen, setDropOpen] = useState(false);
  useEffect(() => {
    api.getTemplates().then(d => { setTemplates(d.templates); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats = [
    { key:'wedding', icon:<RingIcon size={20} color='#996b3d'/>, label:lang==='uz'?'To\'y taklifnomasi':'Свадебное приглашение' },
    { key:'birthday', icon:<CakeIcon size={20} color='#e85d04'/>, label:lang==='uz'?'Tug\'ilgan kun taklifnomasi':'День рождения' },
    { key:'event', icon:<PartyIcon size={20} color='#2563eb'/>, label:lang==='uz'?'Tadbir taklifnomasi':'Мероприятие' },
    { key:'love', icon:<HeartIcon size={20} color='#e74c6f'/>, label:lang==='uz'?'Sevgi xati':'Любовное письмо' },
  ];

  const cn = catNames(t);

  const getSampleDisplay = (tp) => {
    const s = typeof tp.sample_data === 'string' ? JSON.parse(tp.sample_data || '{}') : (tp.sample_data || {});
    if (tp.category === 'wedding') return { l1: s.name1 || 'Ali', l2: '&', l3: s.name2 || 'Zarina', l4: s.date || '' };
    if (tp.category === 'birthday') return { l1: s.person || 'Ism', l4: s.date || '' };
    if (tp.category === 'event') return { l1: s.name || 'Tadbir', l4: s.date || '' };
    return { l1: s.from || '❤️', l3: s.to || '' };
  };

  return (
    <div>
      {/* Dropdown — "Bugun nima yasaymiz?" */}
      <div className="dropdown-wrap" style={{ marginTop: 16 }}>
        <button className={`dropdown-btn ${dropOpen ? 'open' : ''}`} onClick={() => setDropOpen(!dropOpen)}>
          <SparkleIcon size={18} color='#d4a574'/>
          <span>{lang === 'uz' ? 'Bugun nima yasaymiz?' : 'Что создадим сегодня?'}</span>
          <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        {dropOpen && (
          <div className="dropdown-menu">
            {cats.map(c => (
              <button key={c.key} className="dropdown-item" onClick={() => { setDropOpen(false); navigate(`/templates/${c.key}`); }}>
                <span className="dropdown-item-icon">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Maxsus taklifnoma banner */}
      <div className="custom-banner">
        <div className="custom-banner-title">{lang === 'uz' ? 'Maxsus taklifnoma buyurtmasi' : 'Индивидуальное приглашение'}</div>
        <div className="custom-banner-text">
          {lang === 'uz'
            ? "Shaxsiy talablaringiz asosida alohida domen va profillik sayt orqali yasab beriladigan maxsus taklifnoma. O'zingiz xohlagan barcha elementlar bilan!"
            : 'Персональный сайт на отдельном домене с уникальным дизайном по вашим требованиям.'}
        </div>
        <div className="custom-banner-price">{lang === 'uz' ? '159 000 so\'mdan' : 'от 159 000 сум'}</div>
        <div className="feat-row">
          <div className="feat-row-item"><SparkleIcon size={16} color='#d4a574'/> {lang==='uz'?'Tez':'Быстро'}</div>
          <div className="feat-row-item"><SparkleIcon size={16} color='#d4a574'/> {lang==='uz'?'Professional':'Проф.'}</div>
          <div className="feat-row-item"><svg style={{width:16,height:16,verticalAlign:'middle'}} viewBox='0 0 24 24' fill='none'><rect x='5' y='2' width='14' height='20' rx='3' stroke='#d4a574' strokeWidth='1.5'/><circle cx='12' cy='18' r='1' fill='#d4a574'/></svg> {lang==='uz'?'Mobil':'Мобильный'}</div>
        </div>
        <button className="custom-banner-btn" onClick={() => window.open('https://t.me/ndd_admin')}>
          📩 {lang === 'uz' ? 'Buyurtma berish' : 'Заказать'}
        </button>
      </div>

      {/* Tavsiya etiladi */}
      <div className="sec-hdr" style={{ padding: '0 20px', marginBottom: 12 }}>
        <div className="sec-title">{lang === 'uz' ? 'Tavsiya etiladi' : 'Рекомендуемые'}</div>
        <Link to="/templates/wedding" className="sec-link">{t.viewAll} →</Link>
      </div>

      {/* Horizontal template cards */}
      {loading ? (
        <div style={{ padding: '0 20px' }}>{[1, 2].map(i => <div key={i} className="skel-card" style={{ height: 160, marginBottom: 12 }} />)}</div>
      ) : templates.length > 0 ? (
        // Tavsiya etiladi: 1 bepul to'y + 2 pullik to'y + 1 sevgi xati
        (() => {
          const featured = ['w1', 'w2', 'w5', 'l1'];
          const sorted = featured
            .map(id => templates.find(t => t.id === id))
            .filter(Boolean);
          // Agar featured topilmasa, oddiy 4 ta ko'rsatish
          const show = sorted.length >= 3 ? sorted : templates.slice(0, 4);
          return show;
        })().map(tp => {
          const s = getSampleDisplay(tp);
          const name = lang === 'uz' ? tp.name_uz : tp.name_ru;
          const desc = lang === 'uz' ? (tp.tag_uz || '') : (tp.tag_ru || '');
          return (
            <div className="tpl-h-card" key={tp.id}>
              <div className="tpl-h-img" style={{ background: tp.bg_style || 'linear-gradient(135deg, #f5f0e8, #fff9f0)' }}>
                <div className="tpl-sample" style={{ color: tp.text_color || '#5c4a3a' }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{s.l1}</div>
                  {s.l2 && <div style={{ fontSize: 14, fontStyle: 'italic', opacity: .7 }}>{s.l2}</div>}
                  {s.l3 && <div style={{ fontSize: 16, fontWeight: 700 }}>{s.l3}</div>}
                  {s.l4 && <div style={{ fontSize: 10, opacity: .6, marginTop: 6 }}>{s.l4}</div>}
                </div>
              </div>
              <div className="tpl-h-info">
                <div className="tpl-h-name">{cn[tp.category]} {lang === 'uz' ? 'taklifnomasi' : ''}</div>
                <div className="tpl-h-price">{tp.is_free ? (lang === 'uz' ? 'Bepul' : 'Бесплатно') : tp.price?.toLocaleString() + ' so\'m'}</div>
                <div className="tpl-h-desc">{desc || name}</div>
                <div className="tpl-h-btns">
                  <button className="tpl-h-btn primary" onClick={() => {
                    if (!user) navigate(`/auth?redirect=/create/${tp.category}/${tp.id}`);
                    else navigate(`/create/${tp.category}/${tp.id}`);
                  }}><SparkleIcon size={12} color='#fff'/> {lang === 'uz' ? 'Yasash' : 'Создать'}</button>
                  <button className="tpl-h-btn secondary" onClick={() => navigate(`/preview/${tp.id}`)}><EyeIcon size={14}/> {lang === 'uz' ? 'Ko\'rish' : 'Смотреть'}</button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">{lang==='uz'?'Shablonlar qo\'shilmagan':'Шаблоны не добавлены'}</div>
        </div>
      )}

      {/* Social */}
      <div className="social-footer">
        <div className="social-footer-text">{lang === 'uz' ? 'Bizning ijtimoiy tarmoqlarimiz' : 'Наши соцсети'}</div>
        <div className="social-footer-links">
          <a href="https://t.me/taklifnomachi_online" target="_blank" rel="noopener" aria-label="Telegram"><TgIcon size={20} color="#0088cc"/></a>
          <a href="https://www.instagram.com/taklifnomachi.online" target="_blank" rel="noopener" aria-label="Instagram"><IgIcon size={20} color="#E4405F"/></a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ==================== TEMPLATE CARD ====================
function TplCard({ tp }) {
  const { t, lang, user, navigate } = useApp();
  const name = lang === 'uz' ? tp.name_uz : tp.name_ru;
  const tag = lang === 'uz' ? tp.tag_uz : tp.tag_ru;
  const sample = typeof tp.sample_data === 'string' ? JSON.parse(tp.sample_data || '{}') : (tp.sample_data || {});

  return (
    <div className="tpl-card">
      <div className="tpl-thumb" style={{ background: tp.bg_style || 'linear-gradient(135deg,#f5f0e8,#fff9f0)', color: tp.text_color || '#333' }}>
        <span className={`tpl-badge ${tp.is_free ? 'free' : 'premium'}`}>{tp.is_free ? t.free : t.premium}</span>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, marginTop:8, textShadow:"0 1px 6px rgba(0,0,0,0.15)", textAlign:'center', padding:'0 8px' }}>
          {tp.category === 'wedding' && sample && `${sample.name1 || ''} & ${sample.name2 || ''}`}
          {tp.category === 'birthday' && (sample?.person || '')}
          {tp.category === 'event' && (sample?.name || '')}
          {tp.category === 'love' && (sample?.text || '❤️')}
        </div>
        {tp.category === 'wedding' && sample?.date && <div style={{fontSize:10,opacity:.7,marginTop:4}}>{sample.date}</div>}
      </div>
      <div className="tpl-info">
        <div className="tpl-name">{name}</div>
        <span className={`tpl-tag ${tp.category}`}>{tag}</span>
      </div>
      {!tp.is_free && <div className="tpl-price">{tp.price?.toLocaleString()} {t.price}</div>}
      <div className="tpl-actions">
        <button className="tpl-btn view" onClick={() => navigate(`/preview/${tp.id}`)}>👁 {t.preview}</button>
        <button className="tpl-btn make" onClick={() => {
          if (!user) navigate(`/auth?redirect=/create/${tp.category}/${tp.id}`);
          else navigate(`/create/${tp.category}/${tp.id}`);
        }}><SparkleIcon size={14} color='#fff'/> {t.create}</button>
      </div>
    </div>
  );
}

// ==================== TEMPLATES PAGE ====================
function TemplatesPage() {
  const { cat } = useParams();
  const { t } = useApp();
  const [tpls, setTpls] = useState([]);
  useEffect(() => { api.getTemplates(cat).then(d => setTpls(d.templates)).catch(() => {}); }, [cat]);
  const cn = catNames(t);
  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">{cn[cat]} — {t.selectTemplate}</div></div>
      {tpls.length === 0 ? <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text2)',fontSize:14}}>Hozircha shablonlar yo'q. Admin paneldan qo'shing.</div>
        : <div className="tpl-grid">{tpls.map(tp => <TplCard key={tp.id} tp={tp} />)}</div>}
    </div>
  );
}

// ==================== PREVIEW ====================
function PreviewPage() {
  const { id } = useParams();
  const { t, lang, user, navigate } = useApp();
  const [tpl, setTpl] = useState(null);
  useEffect(() => { api.getTemplate(id).then(d => setTpl(d.template)).catch(() => {}); }, [id]);
  if (!tpl) return <div className="loading">{t.loading}</div>;

  const sample = typeof tpl.sample_data === 'string' ? JSON.parse(tpl.sample_data || '{}') : (tpl.sample_data || {});
  const name = lang === 'uz' ? tpl.name_uz : tpl.name_ru;
  const tag = lang === 'uz' ? tpl.tag_uz : tpl.tag_ru;

  // Sample data'ni shablon uchun tayyorlash
  const sampleData = {};
  if (tpl.category === 'wedding') {
    sampleData.groomName = sample.name1 || 'Ali';
    sampleData.brideName = sample.name2 || 'Zarina';
    sampleData.date = sample.date || '2026-06-15';
    sampleData.time = '18:00';
    sampleData.mainText = lang === 'uz'
      ? '"Aziz mehmonlarimiz, hayotimizdagi eng muhim kunni siz bilan birga nishonlashdan baxtiyor bo\'lamiz."'
      : '"Дорогие гости, мы будем счастливы разделить с вами самый важный день в нашей жизни."';
    sampleData.address = sample.loc || 'Toshkent sh., Yunusobod t.';
    sampleData.venueName = 'Namuna to\'yxonasi';
    sampleData.cardNumber = '8600 1234 5678 9012';
  } else if (tpl.category === 'birthday') {
    sampleData.birthdayPerson = sample.person || 'Aziza';
    sampleData.birthdayDate = sample.date || '2026-08-10';
    sampleData.birthdayText = lang === 'uz'
      ? '"Hayotning yana bir go\'zal yili boshlanyapti! Birga nishonlaymiz!"'
      : '"Ещё один прекрасный год начинается! Отметим вместе!"';
    sampleData.birthdayAddress = 'Toshkent sh., Chilonzor t.';
  } else if (tpl.category === 'love') {
    sampleData.loveFrom = sample.from || 'Jasur';
    sampleData.loveTo = sample.to || 'Madina';
    sampleData.loveText = sample.text || (lang === 'uz'
      ? 'Seni birinchi ko\'rganimda, dunyoda eng go\'zal narsani ko\'rgandek his qildim.\n\nSen mening hayotimga kirganingda, hammasi o\'zgardi.\n\nSeni sevaman. Doimo.'
      : 'Когда я впервые тебя увидел, я понял что нашёл самое прекрасное в мире.\n\nЛюблю тебя. Всегда.');
  } else if (tpl.category === 'event') {
    sampleData.eventName = sample.name || 'IT Conference 2026';
    sampleData.eventDesc = sample.sub || (lang === 'uz' ? 'Eng so\'nggi texnologiyalar haqida' : 'О новейших технологиях');
    sampleData.time = sample.date || '2026-10-15';
    sampleData.address = sample.loc || 'Toshkent, IT Park';
  }

  const TemplateComponent = getTemplateComponent(tpl.id, tpl.category);

  return (
    <div>
      {/* Preview header */}
      <div style={{ padding:'12px 20px', background:'var(--white)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:52, zIndex:10 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600 }}>{name}</div>
          <div style={{ fontSize:11, color:'var(--text3)' }}>{tag} • {tpl.is_free ? (lang==='uz'?'Bepul':'Бесплатно') : tpl.price?.toLocaleString() + ' so\'m'}</div>
        </div>
        <button onClick={() => {
          if (!user) navigate(`/auth?redirect=/create/${tpl.category}/${tpl.id}`);
          else navigate(`/create/${tpl.category}/${tpl.id}`);
        }} style={{
          padding:'10px 20px', borderRadius:10, border:'none',
          background:'var(--purple)', color:'#fff',
          fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer',
        }}><SparkleIcon size={14} color='#fff'/> {t.create}</button>
      </div>

      {/* Real template preview */}
      {TemplateComponent ? (
        <Suspense fallback={<div className="loading">{t.loading}</div>}>
          <TemplateComponent data={sampleData} onRespond={() => {}} sent={false} lang={lang} />
        </Suspense>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <div className="empty-state-title">{lang==='uz'?'Preview mavjud emas':'Превью недоступно'}</div>
        </div>
      )}
    </div>
  );
}

// ==================== AUTH ====================
function AuthPage() {
  const { t, lang, setUser, navigate } = useApp();
  const [sp] = useSearchParams();
  const [mode, setMode] = useState('register');
  const [login, setLogin] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [sugs, setSugs] = useState([]);
  const [busy, setBusy] = useState(false);
  const redirect = sp.get('redirect') || '/';

  const submit = async () => {
    setErr(''); setSugs([]); setBusy(true);
    try {
      if (mode === 'login') {
        const d = await api.login(login, pw); setUser(d.user); navigate(redirect);
      } else {
        if (pw.length < 6) { setErr(t.passwordShort); setBusy(false); return; }
        if (pw !== pw2) { setErr(t.passwordMismatch); setBusy(false); return; }
        const d = await api.register(login, pw); setUser(d.user); navigate(redirect);
      }
    } catch (e) { setErr(e.message); if (e.suggestions) setSugs(e.suggestions); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="form-card fu">
        <h2>{mode==='login'?t.loginTitle:t.registerTitle}</h2>
        <div className="fg"><label>{t.login}</label><input className="fi" value={login} onChange={e=>setLogin(e.target.value)} placeholder={t.login}/></div>
        <div className="fg"><label>{t.password}</label><input className="fi" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={t.password}/></div>
        {mode==='register'&&<div className="fg"><label>{t.confirmPassword}</label><input className="fi" type="password" value={pw2} onChange={e=>setPw2(e.target.value)} placeholder={t.confirmPassword}/></div>}
        {err&&<div className="form-err">⚠️ {err}</div>}
        {sugs.length>0&&<div style={{marginTop:8}}><div style={{fontSize:11,color:'var(--text2)',marginBottom:6}}>{t.suggestions}:</div><div className="form-suggest">{sugs.map(s=><button key={s} className="suggest-chip" onClick={()=>setLogin(s)}>{s}</button>)}</div></div>}
        <button className="main-btn" onClick={submit} disabled={busy}>{busy?'...':mode==='login'?t.loginBtn:t.registerBtn}</button>
        <div className="auth-sw">{mode==='login'?t.noAccount:t.hasAccount}{' '}<button onClick={()=>{setMode(m=>m==='login'?'register':'login');setErr('');setSugs([])}}>{mode==='login'?t.registerBtn:t.loginBtn}</button></div>

        {/* Telegram bot orqali ro'yxatdan o'tish tavsiyasi */}
        <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
          <div style={{ fontSize:12, color:'var(--text3)', textAlign:'center', marginBottom:10 }}>
            {lang==='uz'?'Shuningdek, quyidagi usullar orqali ham ro\'yxatdan o\'tishingiz mumkin:':'Также можно зарегистрироваться через:'}
          </div>
          <a href="https://t.me/Taklifnomachi_online_bot" target="_blank" rel="noopener" style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'12px 16px', borderRadius:12, border:'1px solid var(--border)',
            background:'var(--bg)', textDecoration:'none', color:'var(--text)',
            fontSize:13, fontWeight:600, marginBottom:8
          }}>
             Telegram bot orqali
          </a>
          <div style={{ fontSize:11, color:'var(--text3)', textAlign:'center' }}>
            {lang==='uz'?'Tez va qulay — botda maxsus kod orqali ro\'yxatdan o\'ting':'Быстро и удобно — регистрация через бот с уникальным кодом'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== FORM ====================
function FormPage() {
  const { cat, tplId } = useParams();
  const { t, lang, navigate } = useApp();
  const [f, sF] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => sF(p => ({ ...p, [k]: v }));
  const cn = catNames(t);

  const fields = {
    wedding: [
      {k:'groomName',l:t.groomName},{k:'brideName',l:t.brideName},
      {k:'mainText',l:t.mainText,ta:true},
      {k:'date',l:t.date,type:'date'},{k:'time',l:t.time,type:'time'},
      {k:'venueName',l:lang==='uz'?'To\'yxona nomi':'Название ресторана',ph:lang==='uz'?'Masalan: Visol to\'yxonasi':'Например: Ресторан Висол'},
      {k:'address',l:t.address,ph:lang==='uz'?'Toshkent sh., Chilonzor t., Bunyodkor ko\'chasi 1-uy':'Ташкент, Чиланзар...'},
      {k:'googleMapsUrl',l:'Google Maps link',opt:true,ph:'https://maps.google.com/...'},
      {k:'yandexMapsUrl',l:'Yandex Maps link',opt:true,ph:'https://yandex.uz/maps/...'},
      {k:'cardNumber',l:t.cardNumber,opt:true,ph:'8600 1234 5678 9012'},
    ],
    birthday: [{k:'birthdayPerson',l:t.birthdayPerson},{k:'birthdayDate',l:t.birthdayDate,type:'datetime-local'},{k:'birthdayText',l:t.birthdayText,ta:true},{k:'birthdayAddress',l:t.birthdayAddress},{k:'birthdayExtra',l:t.birthdayExtra,opt:true}],
    event: [{k:'eventName',l:t.eventName},{k:'eventDesc',l:t.eventDesc,ta:true},{k:'time',l:t.time,type:'datetime-local'},{k:'address',l:t.address},{k:'eventExtra',l:t.eventExtra,opt:true}],
    love: [{k:'loveFrom',l:t.loveFrom},{k:'loveTo',l:t.loveTo},{k:'loveText',l:t.loveText,ta:true}],
  };

  const submit = async () => {
    setBusy(true); setErr('');
    try { const d = await api.createInvitation(tplId, cat, f); navigate(`/share/${d.invitation.uid}`); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{ padding:'20px' }}>
      <div className="form-card fu">
        <h2 style={{ fontSize:18 }}>{cn[cat]} — {t.fillInfo}</h2>
        {(fields[cat]||[]).map(fld => (
          <div className="fg" key={fld.k}>
            <label>{fld.l} {fld.opt&&<span style={{opacity:.4,fontWeight:400}}>({t.optional})</span>}</label>
            {fld.ta ? <textarea className="fi" value={f[fld.k]||''} onChange={e=>set(fld.k,e.target.value)} placeholder={fld.ph||fld.l}/>
              : <input className="fi" type={fld.type||'text'} value={f[fld.k]||''} onChange={e=>set(fld.k,e.target.value)} placeholder={fld.ph||fld.l}/>}
          </div>
        ))}
        {err&&<div className="form-err">⚠️ {err}</div>}
        <button className="main-btn" onClick={submit} disabled={busy}>{busy?'...':`✨ ${t.generateLink}`}</button>
      </div>
    </div>
  );
}

// ==================== QR CODE GENERATOR ====================
function QRCode({ text, size = 160 }) {
  // Simple QR via external API
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=7c3aed&margin=8`;
  return <img src={url} alt="QR Code" style={{ width: size, height: size, borderRadius: 12, border: '1px solid var(--border)' }} />;
}

// ==================== SHARE ====================
function SharePage() {
  const { uid } = useParams();
  const { t, lang, navigate } = useApp();
  const [inv, setInv] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);
  const [slug, setSlug] = useState('');
  const [paidLink, setPL] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [card, setCard] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const [payErr, setPayErr] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    api.getInvByUid(uid).then(d => {
      const invitation = d.invitation;
      setInv(invitation);
      if (!invitation.is_free && !invitation.is_paid) {
        fetch('/api/payments/card').then(r=>r.json()).then(c=>{if(c.card_number)setCard(c);}).catch(()=>{});
      }
    }).catch(() => {});
  }, [uid]);

  if (!inv) return <div className="loading">{t.loading}</div>;

  const copy = (txt, fn) => { navigator.clipboard?.writeText(txt).then(()=>{fn(true);setTimeout(()=>fn(false),2000)}); };
  const nativeShare = (link) => { if(navigator.share) navigator.share({title:lang==="uz"?"Taklifnoma":"Приглашение",url:link}).catch(()=>{}); };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file); setPayErr('');
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const uploadScreenshot = async () => {
    if (!screenshot) return;
    setUploading(true); setPayErr('');
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('invitation_uid', inv.uid);
      const token = localStorage.getItem('tkn_token');
      const r = await fetch('/api/payments/upload', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Xatolik');
      setShowSuccess(true); setPayDone(true);
      setTimeout(() => setShowSuccess(false), 3000);
      api.getInvByUid(uid).then(d => setInv(d.invitation)).catch(() => {});
    } catch (e) { setPayErr(e.message); }
    finally { setUploading(false); }
  };

  // Bepul taklifnoma
  if (inv.is_free && inv.link) {
    return (
      <div className="share-card fu">
        <div style={{fontSize:48,marginBottom:12}}><SparkleIcon size={48} color="var(--purple)"/></div>
        <h3>{t.readyTitle}</h3>
        <div className="sub">{t.readySub}</div>
        <div className="link-box">{inv.link}</div>
        <button className="copy-btn" onClick={()=>copy(inv.link,setCopied)}>
          {copied?<><CheckIcon size={14} color="#16a34a"/> {t.copied}</>:<><CopyIcon size={14}/> {t.copyLink}</>}
        </button>
        <div className="share-row">
          <button className="share-btn wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(inv.link)}`)}>💬 {t.shareWhatsapp}</button>
          <button className="share-btn tg" onClick={()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}`)}><TgIcon color="#fff"/> {t.shareTelegram}</button>
        </div>
        {navigator.share&&<button onClick={()=>nativeShare(inv.link)} style={{width:"100%",padding:14,borderRadius:12,border:"1.5px solid var(--border)",background:"var(--white)",fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:8,color:"var(--text1)"}}>📤 {lang==="uz"?"Boshqa ilovalar orqali":"Через другие приложения"}</button>}
        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={()=>setShowQR(!showQR)} style={{background:"none",border:"none",color:"var(--purple)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            {showQR?"🔼 QR yashirish":"🔽 QR kod ko'rsatish"}
          </button>
          {showQR&&<div style={{marginTop:12,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><QRCode text={inv.link}/><div style={{fontSize:11,color:"var(--text3)"}}>QR kodni skanerlang</div></div>}
        </div>
        <div style={{marginTop:16}}>
          <button onClick={()=>window.open(inv.link,"_blank")} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--bg)",fontFamily:"Inter,sans-serif",fontSize:13,cursor:"pointer",color:"var(--text2)"}}>
            👁 {lang==="uz"?"Taklifnomani ko'rish":"Просмотреть приглашение"}
          </button>
        </div>
      </div>
    );
  }

  // To'lov tasdiqlangan — slug tanlash
  if (inv.is_paid || payDone) {
    return (
      <div className="pay-card fu" style={{borderColor:"#bbf7d0"}}>
        {showSuccess&&(
          <div className="pay-success-overlay">
            <div className="pay-success-box">
              <div className="pay-success-check">✓</div>
              <div className="pay-success-title">{lang==="uz"?"To'lov tasdiqlandi!":"Оплата подтверждена!"}</div>
              <div className="pay-success-sub">{lang==="uz"?"Endi linkingizni yarating":"Теперь создайте вашу ссылку"}</div>
            </div>
          </div>
        )}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28,color:"#fff"}}>✓</div>
          <h3 style={{color:"#16a34a",fontSize:18,margin:"0 0 6px"}}>{lang==="uz"?"To'lov tasdiqlandi!":"Оплата подтверждена!"}</h3>
          <div style={{fontSize:13,color:"var(--text2)"}}>{lang==="uz"?"Endi maxsus link nomini tanlang":"Выберите персональное имя ссылки"}</div>
        </div>
        <div style={{borderTop:"1px solid var(--border)",paddingTop:20}}>
          <label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:6}}>{t.customLink}</label>
          <div style={{fontSize:11,color:"var(--text2)",marginBottom:10}}>{t.customLinkHint}</div>
          <div className="slug-row">
            <div className="slug-pre">{window.location.host}/v/</div>
            <input className="slug-inp" value={slug} onChange={e=>setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g,"").slice(0,30))} placeholder="dilnoza-javohir"/>
          </div>
          <button className="main-btn" style={{marginTop:12}} disabled={slug.length<3} onClick={async()=>{
            try{const d=await api.setSlug(inv.id,slug);setPL(d.link);}catch(e){alert(e.message);}
          }}>{t.createLink}</button>
          {paidLink&&<div style={{marginTop:16}}>
            <div className="link-box">{paidLink}</div>
            <button className="copy-btn" style={{marginTop:8}} onClick={()=>copy(paidLink,setCopied)}>
              {copied?<><CheckIcon size={14} color="#16a34a"/> {t.copied}</>:<><CopyIcon size={14}/> {t.copyLink}</>}
            </button>
            <div className="share-row" style={{marginTop:8}}>
              <button className="share-btn wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(paidLink)}`)}>💬 WhatsApp</button>
              <button className="share-btn tg" onClick={()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(paidLink)}`)}><TgIcon color="#fff"/> Telegram</button>
            </div>
          </div>}
        </div>
      </div>
    );
  }

  // Premium — to'lov sahifasi
  return (
    <div className="pay-card fu" style={{border:"none",padding:"20px 16px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:13,color:"var(--text2)",marginBottom:4}}>{lang==="uz"?"Premium shablon":"Премиум шаблон"}</div>
        <div style={{fontSize:28,fontWeight:800,color:"var(--text1)"}}>{inv.price?.toLocaleString()} <span style={{fontSize:16,fontWeight:500}}>so'm</span></div>
      </div>

      <div className="pay-bank-card">
        <div className="pay-bank-top">
          <div className="pay-bank-label">{lang==="uz"?"TO'LOV KARTASI":"КАРТА ДЛЯ ОПЛАТЫ"}</div>
          {card&&<div className="pay-bank-type">{card.card_type}</div>}
        </div>
        {card ? <>
          <div className="pay-bank-number">{card.card_number.replace(/\s/g,"").replace(/(\d{4})/g,"$1 ").trim()}</div>
          <div className="pay-bank-owner">{card.card_owner}</div>
        </> : <div style={{fontSize:13,opacity:.7,padding:"16px 0",textAlign:"center"}}>{lang==="uz"?"Yuklanmoqda...":"Загрузка..."}</div>}
        <div className="pay-bank-shine"/>
      </div>

      {card&&(
        <button className="pay-copy-btn" onClick={()=>copy(card.card_number.replace(/\s/g,""),setCardCopied)}>
          {cardCopied?<><CheckIcon size={15} color="#16a34a"/> {lang==="uz"?"Nusxalandi!":"Скопировано!"}</> :<><CopyIcon size={15}/> {lang==="uz"?"Karta raqamini nusxalash":"Скопировать номер карты"}</>}
        </button>
      )}

      <div className="pay-steps">
        {(lang==="uz"?[
          {n:1,text:`${inv.price?.toLocaleString()} so'm yuqoridagi kartaga o'tkazing`},
          {n:2,text:"To'lov screenshotini oling"},
          {n:3,text:"Quyida screenshotni yuklang"},
        ]:[
          {n:1,text:`Переведите ${inv.price?.toLocaleString()} сум на карту выше`},
          {n:2,text:"Сделайте скриншот оплаты"},
          {n:3,text:"Загрузите скриншот ниже"},
        ]).map(s=>(
          <div key={s.n} className="pay-step-item">
            <div className="pay-step-num">{s.n}</div>
            <div className="pay-step-text">{s.text}</div>
          </div>
        ))}
      </div>

      <div className="pay-upload-wrap">
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>{lang==="uz"?"📸 To'lov screenshotini yuklang":"📸 Загрузите скриншот оплаты"}</div>
        <label className={`pay-upload-zone${screenshot?" uploaded":""}`}>
          <input type="file" accept="image/*" style={{display:"none"}} onChange={onFileChange}/>
          {screenshotPreview ? (
            <div className="pay-upload-preview">
              <img src={screenshotPreview} alt="preview"/>
              <div className="pay-upload-change">{lang==="uz"?"Boshqa rasm tanlash":"Заменить фото"}</div>
            </div>
          ) : (
            <div className="pay-upload-placeholder">
              <div className="pay-upload-icon">📎</div>
              <div className="pay-upload-hint">{lang==="uz"?"Rasmni bosib tanlang":"Нажмите для выбора фото"}</div>
              <div className="pay-upload-sub">JPG, PNG • max 5MB</div>
            </div>
          )}
        </label>
      </div>

      {payErr&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#dc2626",marginBottom:12}}>⚠️ {payErr}</div>}

      <button className="main-btn" style={{fontSize:15,padding:"16px"}} disabled={!screenshot||uploading} onClick={uploadScreenshot}>
        {uploading?<span className="pay-uploading">{lang==="uz"?"Yuklanmoqda...":"Загрузка..."}</span>:(lang==="uz"?"✅ To'lovni tasdiqlash":"✅ Подтвердить оплату")}
      </button>

      <div className="pay-admin-row">
        <span style={{fontSize:12,color:"var(--text2)"}}>{lang==="uz"?"Savol bor?":"Есть вопросы?"}</span>
        <a href="https://t.me/ndd_admin" target="_blank" rel="noopener noreferrer" className="pay-admin-link">
          <span>{lang==="uz"?"Admin bilan bog'lanish":"Написать администратору"}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>
    </div>
  );
}


// ==================== VIEW INVITATION (PUBLIC LINK) ====================
function ViewInvPage() {
  const { slug } = useParams();
  const { t, lang } = useApp();
  const [inv, setInv] = useState(null);
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.viewBySlug(slug)
      .then(d => setInv(d.invitation))
      .catch(() => setErr(true));
  }, [slug]);

  if (err) return (
    <div style={{textAlign:'center',padding:'60px 20px'}}>
      <div style={{fontSize:48,marginBottom:12}}>😔</div>
      <div style={{fontSize:16,fontWeight:600,color:'var(--text2)'}}>{lang==='uz'?'Taklifnoma topilmadi':'Приглашение не найдено'}</div>
      <Link to="/" style={{color:'var(--purple)',fontSize:14,marginTop:12,display:'inline-block'}}>← {lang==='uz'?'Bosh sahifa':'Главная'}</Link>
    </div>
  );
  if (!inv) return <div className="loading">{t.loading}</div>;

  const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;

  const handleRespond = async ({ rsvp, guestCount, message, senderName }) => {
    try { await api.sendResponse(inv.id, rsvp, guestCount, message, senderName); setSent(true); }
    catch (e) { alert(e.message); }
  };

  // Registry'dan shablon komponentini top
  const TemplateComponent = getTemplateComponent(inv.template_id, inv.category);

  if (TemplateComponent) {
    return (
      <Suspense fallback={<div className="loading">{t.loading}</div>}>
        <TemplateComponent data={d} invitation={inv} onRespond={handleRespond} sent={sent} lang={lang} />
      </Suspense>
    );
  }

  // Fallback — shablon topilmadi
  return (
    <div style={{textAlign:'center',padding:'60px 20px'}}>
      <div style={{fontSize:48,marginBottom:12}}>📄</div>
      <div style={{fontSize:16,fontWeight:600,color:'var(--text2)'}}>{lang==='uz'?'Shablon topilmadi':'Шаблон не найден'}</div>
    </div>
  );
}

// ==================== PROFILE ====================
function ProfilePage() {
  const { t, lang, user, logout, navigate } = useApp();
  const [invs, setInvs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) api.getMyInvitations().then(d => setInvs(d.invitations)).catch(() => {}).finally(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  if (!user) return (
    <div className="auth-wrap">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{lang === 'uz' ? 'Avval tizimga kiring' : 'Сначала войдите в систему'}</div>
        <button className="main-btn" onClick={() => navigate('/auth')}>{t.loginBtn}</button>
      </div>
    </div>
  );

  const cn = catNames(t);
  const catIcons = { wedding: <RingIcon size={16} color='#996b3d'/>, birthday: <CakeIcon size={16} color='#e85d04'/>, event: <MicIcon size={16} color='#2563eb'/>, love: <HeartIcon size={16} color='#e74c6f'/> };

  const getTitle = (inv) => {
    const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
    if (inv.category === 'wedding') return `${d.groomName || ''} & ${d.brideName || ''}`;
    if (inv.category === 'birthday') return d.birthdayPerson || '';
    if (inv.category === 'event') return d.eventName || '';
    return `${d.loveFrom || ''} ❤️ ${d.loveTo || ''}`;
  };

  // Stats
  const total = invs.length;
  const totalResp = invs.reduce((s, i) => s + (Number(i.response_count) || 0), 0);
  const totalViews = invs.reduce((s, i) => s + (Number(i.views) || 0), 0);

  return (
    <div>
      {/* Profile header */}
      <div className="prof-hdr fu">
        <div className="prof-avatar">{user.login[0]?.toUpperCase()}</div>
        <div className="prof-name">{user.login}</div>
        <div className="prof-id">{t.yourId}: {user.uid}</div>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px', marginBottom: 20 }}>
        {[
          { v: total, l: lang === 'uz' ? 'Taklifnomalar' : 'Приглашения', i: <MailIcon size={20} color='var(--purple)'/> },
          { v: totalResp, l: lang === 'uz' ? 'Javoblar' : 'Ответы', i: <MessageIcon size={20} color='var(--purple)'/> },
          { v: totalViews, l: lang === 'uz' ? 'Ko\'rishlar' : 'Просмотры', i: <EyeIcon size={20} color='var(--purple)'/> },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: 'var(--white)', borderRadius: 12, padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 20 }}>{s.i}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--purple)' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Create new */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <button className="main-btn" onClick={() => navigate('/templates/wedding')} style={{ width: '100%' }}>
          ✨ {lang === 'uz' ? 'Yangi taklifnoma yaratish' : 'Создать новое приглашение'}
        </button>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, padding: '0 20px', marginBottom: 12 }}>{t.myInvitations}</div>

      {loading ? (
        <div style={{ padding: '0 20px' }}>{[1, 2].map(i => <div key={i} className="skel-card" style={{ height: 80, marginBottom: 8 }} />)}</div>
      ) : invs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">{t.noInvitations}</div>
          <div className="empty-state-sub">{lang === 'uz' ? 'Birinchi taklifnomangizni yarating!' : 'Создайте своё первое приглашение!'}</div>
        </div>
      ) : invs.map(inv => (
        <div key={inv.id} className="inv-item" onClick={() => navigate(`/profile/inv/${inv.id}`)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{catIcons[inv.category] || '📨'}</span>
            <span className="inv-item-type" style={{ margin: 0 }}>{cn[inv.category]}</span>
            {!inv.is_free && !inv.is_paid && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}><WalletIcon size={10} color='#92400e'/> {lang === 'uz' ? 'To\'lov kutilmoqda' : 'Ожидает оплаты'}</span>}
          </div>
          <div className="inv-item-title">{getTitle(inv)}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>
            <span><CalendarIcon size={12}/> {new Date(inv.created_at).toLocaleDateString()}</span>
            {inv.response_count > 0 && <span><MessageIcon size={12}/> {inv.response_count}</span>}
            {inv.views > 0 && <span><EyeIcon size={12}/> {inv.views}</span>}
          </div>
        </div>
      ))}

      <button className="logout-btn" onClick={logout}>{t.logout}</button>
      <Footer />
    </div>
  );
}

// ==================== PROFILE INV DETAIL ====================
function ProfileInvPage() {
  const { id } = useParams();
  const { t, lang, navigate } = useApp();
  const [inv, setInv] = useState(null);
  const [resps, setResps] = useState([]);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getInvByUid(id)
      .then(d => { setInv(d.invitation); return api.getResponses(d.invitation.id); })
      .then(d => setResps(d.responses)).catch(() => {});
  }, [id]);

  if (!inv) return <div className="loading">{t.loading}</div>;
  const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
  const cn = catNames(t);
  const title = inv.category === 'wedding' ? `${d.groomName} & ${d.brideName}` : inv.category === 'birthday' ? d.birthdayPerson : inv.category === 'event' ? d.eventName : `${d.loveFrom} → ${d.loveTo}`;

  const copyLink = () => { if (inv.link) navigator.clipboard?.writeText(inv.link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  // RSVP stats
  const attending = resps.filter(r => r.rsvp === 'attending').length;
  const notAttending = resps.filter(r => r.rsvp === 'notAttending').length;
  const maybe = resps.filter(r => r.rsvp === 'maybe').length;
  const totalGuests = resps.filter(r => r.rsvp === 'attending').reduce((s, r) => s + (r.guest_count || 1), 0);

  return (
    <div style={{ padding: '16px 20px 30px' }}>
      {/* Header card */}
      <div className="form-card fu" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{cn[inv.category]}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{title}</div>
        {inv.link && (<>
          <div className="link-box" style={{ marginTop: 12, fontSize: 11 }}>{inv.link}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={copyLink} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              {copied ? '✅' : '📋'} {copied ? (lang === 'uz' ? 'Nusxalandi' : 'Скопировано') : (lang === 'uz' ? 'Nusxalash' : 'Скопировать')}
            </button>
            <button onClick={() => window.open(inv.link, '_blank')} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              👁 {lang === 'uz' ? 'Ko\'rish' : 'Открыть'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(inv.link)}`)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>💬 WhatsApp</button>
            <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}`)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', background: '#0088cc', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}><TgIcon color="#fff"/> Telegram</button>
          </div>
        </>)}
        {inv.views > 0 && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>👁 {inv.views} {lang === 'uz' ? 'marta ko\'rildi' : 'просмотров'}</div>}
      </div>

      {/* RSVP Stats */}
      {resps.length > 0 && inv.category !== 'love' && (
        <div className="form-card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}><ChartIcon size={16}/> {lang === 'uz' ? 'RSVP statistika' : 'Статистика RSVP'}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[
              { v: attending, l: lang === 'uz' ? 'Keladi' : 'Придут', c: 'var(--green)', bg: '#ecfdf5' },
              { v: notAttending, l: lang === 'uz' ? 'Kelmaydi' : 'Не придут', c: 'var(--red)', bg: '#fef2f2' },
              { v: maybe, l: lang === 'uz' ? 'Bilmaydi' : 'Не уверены', c: 'var(--orange)', bg: '#fffbeb' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: s.c, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {totalGuests > 0 && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', fontSize: 13, textAlign: 'center' }}>
              <UsersIcon size={14}/> {lang === 'uz' ? 'Jami mehmonlar' : 'Всего гостей'}: <b style={{ color: 'var(--purple)' }}>{totalGuests}</b>
            </div>
          )}
          {/* Mini bar chart */}
          {resps.length > 0 && (
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 10, background: 'var(--bg)' }}>
              {attending > 0 && <div style={{ width: (attending / resps.length * 100) + '%', background: 'var(--green)' }} />}
              {maybe > 0 && <div style={{ width: (maybe / resps.length * 100) + '%', background: 'var(--orange)' }} />}
              {notAttending > 0 && <div style={{ width: (notAttending / resps.length * 100) + '%', background: 'var(--red)' }} />}
            </div>
          )}
        </div>
      )}

      {/* Responses */}
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}><MessageIcon size={16}/> {t.responses} ({resps.length})</div>
      {resps.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px 0' }}>
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-title">{t.noResponses}</div>
          <div className="empty-state-sub">{lang === 'uz' ? 'Linkni ulashing — javoblar shu yerda ko\'rinadi' : 'Поделитесь ссылкой — ответы появятся здесь'}</div>
        </div>
      ) : resps.map(r => (
        <div key={r.id} className="inv-item" style={{ margin: '0 0 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {r.sender_name && <div style={{ fontSize: 14, fontWeight: 600 }}>{r.sender_name}</div>}
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          {r.rsvp && <div style={{ fontSize: 12, fontWeight: 700, color: r.rsvp === 'attending' ? 'var(--green)' : r.rsvp === 'notAttending' ? 'var(--red)' : 'var(--orange)', marginTop: 4 }}>
            {t[r.rsvp]} {r.guest_count > 1 && `(${r.guest_count} ${lang === 'uz' ? 'kishi' : 'чел.'})`}
          </div>}
          {r.message && <div style={{ fontSize: 14, marginTop: 6, color: 'var(--text2)' }}>{r.message}</div>}
        </div>
      ))}
    </div>
  );
}

// ==================== ADMIN PAGE ====================
function AdminPage() {
  const [key, setKey] = useState(() => localStorage.getItem('admin_key') || '');
  const [auth, setAuth] = useState(false);
  const [stats, setStats] = useState(null);
  const [tpls, setTpls] = useState([]);
  const [users, setUsers] = useState([]);
  const [invs, setInvs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const [tab, setTab] = useState('stats');
  const [editTpl, setEditTpl] = useState(null);
  const [newTpl, setNewTpl] = useState(false);
  const [newCard, setNewCard] = useState({card_number:'',card_owner:'',card_type:'HUMO'});
  const [cardSaving, setCardSaving] = useState(false);
  const [cardMsg, setCardMsg] = useState('');
  const [showScreenshot, setShowScreenshot] = useState(null);

  const hdrs = () => ({'Content-Type':'application/json','x-admin-key':key});

  const doLogin = async () => {
    try {
      const r = await fetch('/api/admin/stats',{headers:hdrs()});
      if(!r.ok){alert("Kalit noto'g'ri");return;}
      const d = await r.json();
      setStats(d);setAuth(true);
      localStorage.setItem('admin_key',key);
      loadAll();
    } catch{alert('Xatolik');}
  };

  const loadAll = async () => {
    const h = hdrs();
    try {
      const [s,t,u,i,p,c] = await Promise.all([
        fetch('/api/admin/stats',{headers:h}).then(r=>r.json()),
        fetch('/api/admin/templates',{headers:h}).then(r=>r.json()),
        fetch('/api/admin/users',{headers:h}).then(r=>r.json()),
        fetch('/api/admin/invitations',{headers:h}).then(r=>r.json()),
        fetch('/api/admin/payments',{headers:h}).then(r=>r.json()),
        fetch('/api/payments/card/all',{headers:h}).then(r=>r.json()),
      ]);
      setStats(s);setTpls(t.templates||[]);setUsers(u.users||[]);
      setInvs(i.invitations||[]);setPayments(p.payments||[]);setCards(c.cards||[]);
    } catch{}
  };

  const saveCard = async () => {
    if(!newCard.card_number||!newCard.card_owner){setCardMsg("Barcha maydonlarni to'ldiring");return;}
    setCardSaving(true);setCardMsg('');
    try{
      const r = await fetch('/api/payments/card',{method:'POST',headers:hdrs(),body:JSON.stringify(newCard)});
      const d = await r.json();
      if(!r.ok) throw new Error(d.error);
      setCardMsg('✅ Karta saqlandi!');
      setNewCard({card_number:'',card_owner:'',card_type:'HUMO'});
      loadAll();
    }catch(e){setCardMsg('❌ '+e.message);}
    finally{setCardSaving(false);}
  };

  const deleteCard = async (id) => {
    if(!confirm("O'chirish?")) return;
    await fetch(`/api/payments/card/${id}`,{method:'DELETE',headers:hdrs()});
    loadAll();
  };

  useEffect(()=>{if(key)doLogin();},[]);

  if(!auth) return (
    <div className="auth-wrap">
      <div className="form-card">
        <h2 style={{fontSize:20}}>🔐 Admin Panel</h2>
        <div className="fg"><label>Admin kalit</label><input className="fi" type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin secret key"/></div>
        <button className="main-btn" onClick={doLogin}>Kirish</button>
      </div>
    </div>
  );

  const tabItems = [
    {id:'stats',icon:'📊',label:'Statistika'},
    {id:'cards',icon:'💳',label:'Kartalar'},
    {id:'payments',icon:'💰',label:"To'lovlar"},
    {id:'templates',icon:'🎨',label:'Shablonlar'},
    {id:'users',icon:'👥',label:'Foydalanuvchilar'},
    {id:'invitations',icon:'📨',label:'Taklifnomalar'},
  ];

  return (
    <div style={{padding:'16px 16px 80px'}}>
      {/* Screenshot modal */}
      {showScreenshot&&(
        <div onClick={()=>setShowScreenshot(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{position:'relative',maxWidth:500,width:'100%'}}>
            <img src={showScreenshot} alt="screenshot" style={{width:'100%',borderRadius:12,maxHeight:'80vh',objectFit:'contain'}}/>
            <button onClick={()=>setShowScreenshot(null)} style={{position:'absolute',top:-12,right:-12,width:32,height:32,borderRadius:'50%',border:'none',background:'#fff',cursor:'pointer',fontSize:16,fontWeight:700}}>✕</button>
          </div>
        </div>
      )}

      <h2 style={{fontSize:20,marginBottom:16}}>🛠 Admin Panel</h2>

      {/* Tablar */}
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
        {tabItems.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:'8px 14px',borderRadius:8,border:'none',background:tab===tb.id?'var(--purple)':'var(--bg)',color:tab===tb.id?'#fff':'var(--text2)',fontFamily:'Inter,sans-serif',fontSize:12,fontWeight:600,cursor:'pointer'}}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {/* STATISTIKA */}
      {tab==='stats'&&stats&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[
            {l:"Foydalanuvchilar",v:stats.users,i:'👥'},
            {l:"Taklifnomalar",v:stats.invitations,i:'📨'},
            {l:"Javoblar",v:stats.responses,i:'💬'},
            {l:"To'lovlar",v:stats.paidPayments,i:'💰'},
            {l:"Daromad",v:(stats.revenue||0).toLocaleString()+" so'm",i:'💵'},
          ].map((s,i)=>(
            <div key={i} style={{background:'var(--white)',borderRadius:12,padding:16,boxShadow:'var(--shadow)'}}>
              <div style={{fontSize:24,marginBottom:4}}>{s.i}</div>
              <div style={{fontSize:22,fontWeight:800}}>{s.v}</div>
              <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* KARTALAR */}
      {tab==='cards'&&(
        <div>
          <div style={{background:'var(--white)',borderRadius:16,padding:20,marginBottom:16,boxShadow:'var(--shadow)'}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>💳 Yangi karta qo'shish</div>
            <div className="fg"><label>Karta raqami</label><input className="fi" value={newCard.card_number} onChange={e=>setNewCard(p=>({...p,card_number:e.target.value}))} placeholder="8600 1234 5678 9012"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div className="fg"><label>Karta egasi</label><input className="fi" value={newCard.card_owner} onChange={e=>setNewCard(p=>({...p,card_owner:e.target.value}))} placeholder="ALIYEV JAHONGIR"/></div>
              <div className="fg"><label>Tur</label>
                <select className="fi" value={newCard.card_type} onChange={e=>setNewCard(p=>({...p,card_type:e.target.value}))}>
                  <option>HUMO</option><option>UzCard</option><option>Visa</option><option>MasterCard</option>
                </select>
              </div>
            </div>
            {cardMsg&&<div style={{fontSize:13,marginTop:8,color:cardMsg.startsWith('✅')?'var(--green)':'var(--red)'}}>{cardMsg}</div>}
            <button className="main-btn" style={{marginTop:12}} onClick={saveCard} disabled={cardSaving}>
              {cardSaving?"Saqlanmoqda...":"💾 Saqlash (avvalgisi nofaol bo'ladi)"}
            </button>
          </div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Barcha kartalar</div>
          {cards.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>Karta yo'q</div>:cards.map(c=>(
            <div key={c.id} style={{background:'var(--white)',borderRadius:12,padding:14,marginBottom:8,boxShadow:'var(--shadow)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:'monospace',letterSpacing:1}}>{c.card_number}</div>
                <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>{c.card_owner} • {c.card_type} • {c.is_active?'✅ Aktiv':'⚫ Nofaol'}</div>
              </div>
              <button onClick={()=>deleteCard(c.id)} style={{padding:'6px 12px',borderRadius:6,border:'1px solid #fecaca',background:'#fef2f2',color:'var(--red)',fontSize:11,cursor:'pointer',fontFamily:'Inter'}}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {/* TO'LOVLAR */}
      {tab==='payments'&&(
        <div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>💰 To'lovlar — {payments.length} ta</div>
          {payments.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>To'lovlar yo'q</div>:payments.map(p=>(
            <div key={p.id} style={{background:'var(--white)',borderRadius:14,padding:16,marginBottom:10,boxShadow:'var(--shadow)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>👤 {p.user_login}</div>
                  <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>{p.category} • {p.inv_uid}</div>
                </div>
                <div style={{fontSize:11,padding:'4px 10px',borderRadius:20,background:p.status==='paid'?'#dcfce7':'#fef3c7',color:p.status==='paid'?'#16a34a':'#92400e',fontWeight:700}}>
                  {p.status==='paid'?'✅ To'langan':'⏳ Kutilmoqda'}
                </div>
              </div>
              {p.paid_at&&<div style={{fontSize:11,color:'var(--text3)',marginBottom:8}}>📅 {new Date(p.paid_at).toLocaleString('uz')}</div>}
              {p.screenshot_base64&&(
                <button onClick={()=>setShowScreenshot(p.screenshot_base64)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg)',fontSize:12,cursor:'pointer',fontFamily:'Inter',color:'var(--purple)',fontWeight:600}}>
                  📸 Screenshotni ko'rish
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SHABLONLAR */}
      {tab==='templates'&&(
        <div>
          <button className="main-btn" style={{marginBottom:16}} onClick={()=>{setNewTpl(true);setEditTpl(null)}}>+ Yangi shablon</button>
          {(newTpl||editTpl)&&<TplForm tpl={editTpl} hdrs={hdrs} onDone={()=>{setNewTpl(false);setEditTpl(null);loadAll()}} onCancel={()=>{setNewTpl(false);setEditTpl(null)}}/>}
          {tpls.map(tp=>(
            <div key={tp.id} style={{background:'var(--white)',borderRadius:12,padding:14,marginBottom:8,boxShadow:'var(--shadow)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{tp.name_uz}</div>
                <div style={{fontSize:11,color:'var(--text2)'}}>{tp.category} • {tp.is_free?'Bepul':tp.price?.toLocaleString()+" so'm"} • {tp.is_active?'✅ Faol':'❌ Nofaol'}</div>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={()=>{setEditTpl(tp);setNewTpl(false)}} style={{padding:'6px 12px',borderRadius:6,border:'1px solid var(--border)',background:'var(--bg)',fontSize:11,cursor:'pointer',fontFamily:'Inter'}}>✏️</button>
                <button onClick={async()=>{if(confirm("O'chirish?")){await fetch(`/api/admin/templates/${tp.id}`,{method:'DELETE',headers:hdrs()});loadAll()}}} style={{padding:'6px 12px',borderRadius:6,border:'1px solid #fecaca',background:'#fef2f2',color:'var(--red)',fontSize:11,cursor:'pointer',fontFamily:'Inter'}}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOYDALANUVCHILAR */}
      {tab==='users'&&(
        <div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>👥 Foydalanuvchilar — {users.length} ta</div>
          {users.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>Foydalanuvchilar yo'q</div>:users.map(u=>(
            <div key={u.id} style={{background:'var(--white)',borderRadius:12,padding:14,marginBottom:8,boxShadow:'var(--shadow)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <div style={{fontSize:14,fontWeight:700}}>👤 {u.login}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{new Date(u.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                <div style={{background:'var(--bg)',borderRadius:8,padding:'8px 10px'}}>
                  <div style={{fontSize:10,color:'var(--text3)',marginBottom:2}}>LOGIN</div>
                  <div style={{fontSize:13,fontWeight:600,fontFamily:'monospace'}}>{u.login}</div>
                </div>
                <div style={{background:'var(--bg)',borderRadius:8,padding:'8px 10px'}}>
                  <div style={{fontSize:10,color:'var(--text3)',marginBottom:2}}>UID</div>
                  <div style={{fontSize:13,fontWeight:600,fontFamily:'monospace'}}>{u.uid}</div>
                </div>
                {u.telegram_id&&<div style={{background:'#e0f2fe',borderRadius:8,padding:'8px 10px',gridColumn:'1/-1'}}>
                  <div style={{fontSize:10,color:'#0369a1',marginBottom:2}}>TELEGRAM ID</div>
                  <div style={{fontSize:13,fontWeight:600,fontFamily:'monospace',color:'#0369a1'}}>{u.telegram_id}</div>
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAKLIFNOMALAR */}
      {tab==='invitations'&&(
        <div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>📨 Taklifnomalar — {invs.length} ta</div>
          {invs.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>Taklifnomalar yo'q</div>:invs.map(inv=>(
            <div key={inv.id} style={{background:'var(--white)',borderRadius:12,padding:14,marginBottom:8,boxShadow:'var(--shadow)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:700}}>{inv.template_name||inv.category}</div>
                <div style={{fontSize:11,padding:'3px 8px',borderRadius:20,background:inv.is_free?'#f0fdf4':'#fef3c7',color:inv.is_free?'#16a34a':'#92400e',fontWeight:600}}>
                  {inv.is_free?'Bepul':'💳 Pullik'}
                </div>
              </div>
              <div style={{fontSize:12,color:'var(--text2)',marginBottom:4}}>
                👤 <strong>{inv.user_login}</strong> • 💬 {inv.response_count} javob • 📅 {new Date(inv.created_at).toLocaleDateString()}
              </div>
              {inv.link&&<div style={{fontSize:11,color:'var(--purple)',wordBreak:'break-all',padding:'6px 8px',background:'#f5f3ff',borderRadius:6}}>{inv.link}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ==================== TEMPLATE FORM (ADMIN) ====================
function TplForm({ tpl, hdrs, onDone, onCancel }) {
  const defaults = { id:'', category:'wedding', name_uz:'', name_ru:'', tag_uz:'', tag_ru:'', is_free:true, price:0, bg_style:'linear-gradient(135deg, #f5f0e8, #fff9f0)', accent_color:'#d4a574', text_color:'#5c4a3a', decoration:'rings', sample_data:'{"name1":"Ali","name2":"Zarina","date":"2026-06-15"}', sort_order:0, is_active:true };
  const init = tpl ? { ...tpl, sample_data: typeof tpl.sample_data==='object'?JSON.stringify(tpl.sample_data,null,2):(tpl.sample_data||'{}') } : defaults;
  const [f, sF] = useState(init);
  const set = (k,v) => sF(p=>({...p,[k]:v}));
  const isEdit = !!tpl;

  const submit = async () => {
    try {
      let sd;
      try { sd = JSON.parse(f.sample_data); } catch { alert('Sample data JSON xato!'); return; }
      const url = isEdit ? `/api/admin/templates/${f.id}` : '/api/admin/templates';
      const method = isEdit ? 'PUT' : 'POST';
      const body = { ...f, sample_data: sd, price: Number(f.price), sort_order: Number(f.sort_order) };
      const r = await fetch(url, { method, headers:hdrs(), body:JSON.stringify(body) });
      if (!r.ok) { const d=await r.json(); alert(d.error||'Xatolik'); return; }
      onDone();
    } catch(e) { alert('Xatolik: '+e.message); }
  };

  const fieldStyle = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 };

  return (
    <div style={{ background:'var(--white)', borderRadius:16, padding:20, marginBottom:16, boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
      <h3 style={{ fontSize:16, marginBottom:12 }}>{isEdit?'✏️ Tahrirlash':'➕ Yangi shablon'}</h3>
      <div style={fieldStyle}>
        {!isEdit&&<div className="fg"><label>ID (masalan: w1, b2)</label><input className="fi" value={f.id} onChange={e=>set('id',e.target.value)} placeholder="w4"/></div>}
        <div className="fg"><label>Kategoriya</label><select className="fi" value={f.category} onChange={e=>set('category',e.target.value)}><option value="wedding">To'y</option><option value="birthday">Tug'ilgan kun</option><option value="event">Tadbir</option><option value="love">Dil izhori</option></select></div>
        <div className="fg"><label>Nom (UZ)</label><input className="fi" value={f.name_uz} onChange={e=>set('name_uz',e.target.value)} placeholder="Oq gul"/></div>
        <div className="fg"><label>Nom (RU)</label><input className="fi" value={f.name_ru} onChange={e=>set('name_ru',e.target.value)} placeholder="Белый цветок"/></div>
        <div className="fg"><label>Tag UZ</label><input className="fi" value={f.tag_uz} onChange={e=>set('tag_uz',e.target.value)} placeholder="Klassik"/></div>
        <div className="fg"><label>Tag RU</label><input className="fi" value={f.tag_ru} onChange={e=>set('tag_ru',e.target.value)} placeholder="Классический"/></div>
        <div className="fg"><label>Bepul?</label><select className="fi" value={String(f.is_free)} onChange={e=>set('is_free',e.target.value==='true')}><option value="true">Ha</option><option value="false">Yo'q</option></select></div>
        <div className="fg"><label>Narxi (so'm)</label><input className="fi" type="number" value={f.price} onChange={e=>set('price',e.target.value)}/></div>
        <div className="fg" style={{gridColumn:'1/-1'}}><label>Background CSS</label><input className="fi" value={f.bg_style} onChange={e=>set('bg_style',e.target.value)} placeholder="linear-gradient(135deg, #f5f0e8, #fff9f0)"/></div>
        <div className="fg"><label>Text color</label><input className="fi" value={f.text_color} onChange={e=>set('text_color',e.target.value)} placeholder="#5c4a3a"/></div>
        <div className="fg"><label>Accent color</label><input className="fi" value={f.accent_color} onChange={e=>set('accent_color',e.target.value)} placeholder="#d4a574"/></div>
        <div className="fg"><label>Decoration</label><input className="fi" value={f.decoration} onChange={e=>set('decoration',e.target.value)} placeholder="rings, hearts, stars, flowers"/></div>
        <div className="fg"><label>Sort order</label><input className="fi" type="number" value={f.sort_order} onChange={e=>set('sort_order',e.target.value)}/></div>
        <div className="fg"><label>Faol?</label><select className="fi" value={String(f.is_active)} onChange={e=>set('is_active',e.target.value==='true')}><option value="true">Ha</option><option value="false">Yo'q</option></select></div>
        <div className="fg" style={{gridColumn:'1/-1'}}><label>Sample data (JSON)</label><textarea className="fi" value={f.sample_data} onChange={e=>set('sample_data',e.target.value)} style={{minHeight:80,fontFamily:'monospace',fontSize:11}}/></div>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:14 }}>
        <button className="main-btn" style={{flex:1}} onClick={submit}>{isEdit?'💾 Saqlash':'✅ Yaratish'}</button>
        <button onClick={onCancel} style={{ flex:1, padding:14, borderRadius:12, border:'1px solid var(--border)', background:'var(--bg)', fontFamily:'Inter', fontSize:14, cursor:'pointer' }}>❌ Bekor</button>
      </div>
    </div>
  );
}
