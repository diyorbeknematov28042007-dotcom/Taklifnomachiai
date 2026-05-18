import { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { T, catNames } from './lib/i18n';
import * as api from './lib/api';
import { getTemplateComponent } from './templates/templateRegistry';

const AppContext = createContext();
function useApp() { return useContext(AppContext); }

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
      <div className="app">
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AppContext.Provider>
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
        <button className="lang-btn" onClick={toggleLang}>🌐 {t.langCode} ▾</button>
        <button className="icon-btn" onClick={() => navigate(user ? '/profile' : '/auth')}>
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
        <a href="https://t.me/taklifnomachi" target="_blank" rel="noopener">✈️</a>
        <a href="https://instagram.com/taklifnomachi" target="_blank" rel="noopener">📸</a>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Taklifnomachi.online</div>
    </div>
  );
}

// ==================== HOME ====================
function Home() {
  const { t, lang, navigate } = useApp();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getTemplates().then(d => { setTemplates(d.templates); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cats = [
    { key:'wedding', icon:'💍', label:t.catWedding, sub:t.catWeddingSub },
    { key:'birthday', icon:'🎂', label:t.catBirthday, sub:t.catBirthdaySub },
    { key:'event', icon:'🔎', label:t.catEvent, sub:t.catEventSub },
    { key:'love', icon:'❤️', label:t.catLove, sub:t.catLoveSub },
  ];

  const steps = lang === 'uz' ? [
    { n:'1', t:'Shablon tanlang', d:"O'zingizga yoqqan dizaynni tanlang" },
    { n:'2', t:"Ma'lumot kiriting", d:"Ism, sana, manzil va boshqa tafsilotlar" },
    { n:'3', t:'Link oling', d:"Tayyor linkni do'stlaringizga yuboring" },
    { n:'4', t:'Javoblarni kuzating', d:"Kim keladi, kim kelmaydi — barchasini ko'ring" },
  ] : [
    { n:'1', t:'Выберите шаблон', d:'Найдите дизайн по душе' },
    { n:'2', t:'Заполните данные', d:'Имена, дата, место и детали' },
    { n:'3', t:'Получите ссылку', d:'Отправьте друзьям и родным' },
    { n:'4', t:'Следите за ответами', d:'Кто придёт, кто нет — всё видно' },
  ];

  return (
    <div>
      <div className="hero fu">
        <div className="hero-deco" />
        <div className="hero-title">{t.heroTitle}</div>
        <div className="hero-sub">{t.heroSub}</div>
      </div>
      <div className="search-bar fu fu1" onClick={() => navigate('/templates/wedding')}>
        <span className="search-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
        <span className="search-text">{t.searchPlaceholder}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </div>
      <div className="cats fu fu2">
        {cats.map(c => (
          <Link key={c.key} to={`/templates/${c.key}`} className="cat-card">
            <div className={`cat-icon-wrap ${c.key}`}>{c.icon}</div>
            <div className="cat-name">{c.label}</div>
            <div className="cat-sub">{c.sub}</div>
          </Link>
        ))}
      </div>
      <div className="about fu fu3">
        <div className="about-content"><h3>{t.aboutTitle}</h3><p>{t.aboutText}</p></div>
        <div className="about-img">📨</div>
      </div>
      <div className="feats fu fu4">
        {[{i:'⚡',t:t.feat1,s:t.feat1sub},{i:'📱',t:t.feat2,s:t.feat2sub},{i:'🔗',t:t.feat3,s:t.feat3sub},{i:'💬',t:t.feat4,s:t.feat4sub}].map((f,i) => (
          <div className="feat" key={i}><div className="feat-icon">{f.i}</div><div className="feat-text">{f.t}</div><div className="feat-sub">{f.s}</div></div>
        ))}
      </div>

      {/* Qanday ishlaydi */}
      <div className="sec-hdr fu fu5">
        <div className="sec-title">{lang==='uz'?'Qanday ishlaydi?':'Как это работает?'}</div>
      </div>
      <div className="steps fu fu5">
        {steps.map(s => (
          <div className="step" key={s.n}>
            <div className="step-num">{s.n}</div>
            <div className="step-info"><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div>
          </div>
        ))}
      </div>

      <div className="sec-hdr fu fu5">
        <div className="sec-title">{t.popularTemplates}</div>
        <Link to="/templates/wedding" className="sec-link">{t.viewAll} →</Link>
      </div>

      {loading ? (
        <div className="tpl-grid" style={{padding:'0 20px 30px'}}>
          {[1,2,3,4].map(i => <div key={i} className="skel-card" />)}
        </div>
      ) : templates.length > 0 ? (
        <div className="tpl-grid fu fu5">
          {templates.slice(0, 4).map(tp => <TplCard key={tp.id} tp={tp} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">{lang==='uz'?'Shablonlar hali qo\'shilmagan':'Шаблоны пока не добавлены'}</div>
          <div className="empty-state-sub">{lang==='uz'?'Admin paneldan shablon qo\'shing':'Добавьте шаблоны из админ-панели'}</div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
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
        }}>✨ {t.create}</button>
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
        }}>✨ {t.create}</button>
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
  const { t, setUser, navigate } = useApp();
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
  const { t, lang } = useApp();
  const [inv, setInv] = useState(null);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCC] = useState(false);
  const [slug, setSlug] = useState('');
  const [paidLink, setPL] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => { api.getInvByUid(uid).then(d=>setInv(d.invitation)).catch(()=>{}); }, [uid]);
  if (!inv) return <div className="loading">{t.loading}</div>;

  const copy = (txt, fn) => { navigator.clipboard?.writeText(txt).then(()=>{fn(true);setTimeout(()=>fn(false),2000)}); };

  const nativeShare = (link) => {
    if (navigator.share) {
      navigator.share({ title: lang==='uz'?'Taklifnoma':'Приглашение', text: lang==='uz'?'Sizni taklifnomaga taklif qilamiz!':'Приглашаем вас!', url: link }).catch(()=>{});
    }
  };

  if (inv.is_free && inv.link) {
    return (
      <div className="share-card fu">
        <div style={{fontSize:48,marginBottom:12}}>🎉</div>
        <h3>{t.readyTitle}</h3>
        <div className="sub">{t.readySub}</div>
        <div className="link-box">{inv.link}</div>
        <button className="copy-btn" onClick={()=>copy(inv.link,setCopied)}>{copied?`✅ ${t.copied}`:`📋 ${t.copyLink}`}</button>
        <div className="share-row">
          <button className="share-btn wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(inv.link)}`)}>💬 {t.shareWhatsapp}</button>
          <button className="share-btn tg" onClick={()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}`)}>✈️ {t.shareTelegram}</button>
        </div>
        {navigator.share && (
          <button onClick={()=>nativeShare(inv.link)} style={{ width:'100%', padding:14, borderRadius:12, border:'1.5px solid var(--border)', background:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer', marginTop:8, color:'var(--text1)' }}>
            📤 {lang==='uz'?'Boshqa ilovalar orqali ulashish':'Поделиться через другие приложения'}
          </button>
        )}
        <div style={{marginTop:20, textAlign:'center'}}>
          <button onClick={()=>setShowQR(!showQR)} style={{ background:'none', border:'none', color:'var(--purple)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
            {showQR?'🔼 QR yashirish':'🔽 QR kod ko\'rsatish'}
          </button>
          {showQR && (
            <div style={{marginTop:12, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <QRCode text={inv.link} />
              <div style={{fontSize:11, color:'var(--text3)'}}>QR kodni skanerlang</div>
            </div>
          )}
        </div>
        <div style={{marginTop:16}}>
          <button onClick={()=>window.open(inv.link,'_blank')} style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg)', fontFamily:'Inter,sans-serif', fontSize:13, cursor:'pointer', color:'var(--text2)' }}>
            👁 {lang==='uz'?'Taklifnomani ko\'rish':'Просмотреть приглашение'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-card fu">
      <h3>🌟 {t.paymentTitle}</h3>
      <div className="pay-price">{inv.price?.toLocaleString()} {t.price}</div>
      <div className="pay-text">{t.paymentSub}</div>
      <div style={{fontSize:12,color:'var(--text2)',marginBottom:6}}>{t.yourCode}:</div>
      <div className="pay-code">{inv.payment_code}</div>
      <button className="copy-btn" style={{margin:'12px auto'}} onClick={()=>copy(inv.payment_code,setCC)}>{codeCopied?`✅ ${t.copied}`:`📋 ${t.copyCode}`}</button>
      <div style={{marginTop:12}}><button className="bot-btn" onClick={()=>window.open(`https://t.me/Paycheck_uzbot?start=pay_${inv.payment_code}`)}>🤖 {t.goToBot}</button></div>
      <div style={{borderTop:'1px solid var(--border)',marginTop:24,paddingTop:20}}>
        <label style={{fontSize:13,fontWeight:600}}>{t.customLink}</label>
        <div style={{fontSize:11,color:'var(--text2)',margin:'6px 0 8px'}}>{t.customLinkHint}</div>
        <div className="slug-row">
          <div className="slug-pre">{window.location.host}/v/</div>
          <input className="slug-inp" value={slug} onChange={e=>setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g,'').slice(0,30))} placeholder="my-event"/>
        </div>
        <div style={{fontSize:11,color:'var(--text3)',margin:'6px 0 12px'}}>{t.afterPayment}</div>
        <button className="main-btn" disabled={slug.length<3} onClick={async()=>{
          try { const d=await api.setSlug(inv.id,slug); setPL(d.link); } catch(e){alert(e.message)}
        }}>{t.createLink}</button>
        {paidLink&&(<div style={{marginTop:12}}>
          <div className="link-box">{paidLink}</div>
          <button className="copy-btn" style={{marginTop:8}} onClick={()=>copy(paidLink,setCopied)}>{copied?`✅ ${t.copied}`:`📋 ${t.copyLink}`}</button>
          <div className="share-row" style={{marginTop:8}}>
            <button className="share-btn wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(paidLink)}`)}>💬 WhatsApp</button>
            <button className="share-btn tg" onClick={()=>window.open(`https://t.me/share/url?url=${encodeURIComponent(paidLink)}`)}>✈️ Telegram</button>
          </div>
        </div>)}
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
  const catIcons = { wedding: '💍', birthday: '🎂', event: '🎤', love: '❤️' };

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
          { v: total, l: lang === 'uz' ? 'Taklifnomalar' : 'Приглашения', i: '📨' },
          { v: totalResp, l: lang === 'uz' ? 'Javoblar' : 'Ответы', i: '💬' },
          { v: totalViews, l: lang === 'uz' ? 'Ko\'rishlar' : 'Просмотры', i: '👁' },
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
            {!inv.is_free && !inv.is_paid && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>💳 {lang === 'uz' ? 'To\'lov kutilmoqda' : 'Ожидает оплаты'}</span>}
          </div>
          <div className="inv-item-title">{getTitle(inv)}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>
            <span>📅 {new Date(inv.created_at).toLocaleDateString()}</span>
            {inv.response_count > 0 && <span>💬 {inv.response_count}</span>}
            {inv.views > 0 && <span>👁 {inv.views}</span>}
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
            <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}`)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', background: '#0088cc', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>✈️ Telegram</button>
          </div>
        </>)}
        {inv.views > 0 && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>👁 {inv.views} {lang === 'uz' ? 'marta ko\'rildi' : 'просмотров'}</div>}
      </div>

      {/* RSVP Stats */}
      {resps.length > 0 && inv.category !== 'love' && (
        <div className="form-card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 {lang === 'uz' ? 'RSVP statistika' : 'Статистика RSVP'}</div>
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
              👥 {lang === 'uz' ? 'Jami mehmonlar' : 'Всего гостей'}: <b style={{ color: 'var(--purple)' }}>{totalGuests}</b>
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
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>💬 {t.responses} ({resps.length})</div>
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
  const [tab, setTab] = useState('stats');
  const [editTpl, setEditTpl] = useState(null);
  const [newTpl, setNewTpl] = useState(false);

  const hdrs = () => ({ 'Content-Type':'application/json', 'x-admin-key': key });

  const doLogin = async () => {
    try {
      const r = await fetch('/api/admin/stats', { headers: hdrs() });
      if (!r.ok) { alert('Kalit noto\'g\'ri'); return; }
      const d = await r.json();
      setStats(d); setAuth(true);
      localStorage.setItem('admin_key', key);
      loadAll();
    } catch { alert('Xatolik'); }
  };

  const loadAll = async () => {
    const h = hdrs();
    try {
      const [s, t, u, i] = await Promise.all([
        fetch('/api/admin/stats', {headers:h}).then(r=>r.json()),
        fetch('/api/admin/templates', {headers:h}).then(r=>r.json()),
        fetch('/api/admin/users', {headers:h}).then(r=>r.json()),
        fetch('/api/admin/invitations', {headers:h}).then(r=>r.json()),
      ]);
      setStats(s); setTpls(t.templates||[]); setUsers(u.users||[]); setInvs(i.invitations||[]);
    } catch {}
  };

  useEffect(() => { if (key) doLogin(); }, []);

  if (!auth) return (
    <div className="auth-wrap">
      <div className="form-card">
        <h2 style={{fontSize:20}}>🔐 Admin Panel</h2>
        <div className="fg"><label>Admin kalit</label><input className="fi" type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin secret key"/></div>
        <button className="main-btn" onClick={doLogin}>Kirish</button>
      </div>
    </div>
  );

  const tabItems = [
    { id:'stats', icon:'📊', label:'Statistika' },
    { id:'templates', icon:'🎨', label:'Shablonlar' },
    { id:'users', icon:'👥', label:'Foydalanuvchilar' },
    { id:'invitations', icon:'📨', label:'Taklifnomalar' },
  ];

  return (
    <div style={{ padding:'16px 20px 40px' }}>
      <h2 style={{ fontSize:20, marginBottom:16 }}>🛠 Admin Panel</h2>
      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {tabItems.map(tb => (
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{ padding:'8px 16px', borderRadius:8, border:'none', background:tab===tb.id?'var(--purple)':'var(--bg)', color:tab===tb.id?'#fff':'var(--text2)', fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {tab==='stats'&&stats&&(
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[{l:'Foydalanuvchilar',v:stats.users,i:'👥'},{l:'Taklifnomalar',v:stats.invitations,i:'📨'},{l:'Javoblar',v:stats.responses,i:'💬'},{l:'To\'lovlar',v:stats.paidPayments,i:'💰'},{l:'Daromad',v:(stats.revenue||0).toLocaleString()+' so\'m',i:'💵'}].map((s,i)=>(
            <div key={i} style={{ background:'var(--white)', borderRadius:12, padding:16, boxShadow:'var(--shadow)' }}>
              <div style={{ fontSize:24, marginBottom:4 }}>{s.i}</div>
              <div style={{ fontSize:22, fontWeight:800 }}>{s.v}</div>
              <div style={{ fontSize:11, color:'var(--text2)', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='templates'&&(
        <div>
          <button className="main-btn" style={{marginBottom:16}} onClick={()=>{setNewTpl(true);setEditTpl(null)}}>+ Yangi shablon</button>
          {(newTpl||editTpl)&&<TplForm tpl={editTpl} hdrs={hdrs} onDone={()=>{setNewTpl(false);setEditTpl(null);loadAll()}} onCancel={()=>{setNewTpl(false);setEditTpl(null)}}/>}
          {tpls.map(tp=>(
            <div key={tp.id} style={{ background:'var(--white)', borderRadius:12, padding:14, marginBottom:8, boxShadow:'var(--shadow)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{tp.name_uz}</div>
                <div style={{ fontSize:11, color:'var(--text2)' }}>{tp.category} • {tp.is_free?'Bepul':tp.price?.toLocaleString()+' so\'m'} • {tp.is_active?'✅ Faol':'❌ Nofaol'}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>{setEditTpl(tp);setNewTpl(false)}} style={{ padding:'6px 12px', borderRadius:6, border:'1px solid var(--border)', background:'var(--bg)', fontSize:11, cursor:'pointer', fontFamily:'Inter' }}>✏️</button>
                <button onClick={async()=>{if(confirm('O\'chirish?')){await fetch(`/api/admin/templates/${tp.id}`,{method:'DELETE',headers:hdrs()});loadAll()}}} style={{ padding:'6px 12px', borderRadius:6, border:'1px solid #fecaca', background:'#fef2f2', color:'var(--red)', fontSize:11, cursor:'pointer', fontFamily:'Inter' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='users'&&(
        <div>{users.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>Foydalanuvchilar yo'q</div>:users.map(u=>(
          <div key={u.id} style={{ background:'var(--white)', borderRadius:10, padding:12, marginBottom:6, boxShadow:'var(--shadow)', fontSize:13 }}>
            <strong>{u.login}</strong> <span style={{ color:'var(--text2)', fontSize:11 }}>ID: {u.uid} • {new Date(u.created_at).toLocaleDateString()}</span>
          </div>
        ))}</div>
      )}

      {tab==='invitations'&&(
        <div>{invs.length===0?<div style={{textAlign:'center',color:'var(--text2)',padding:20}}>Taklifnomalar yo'q</div>:invs.map(inv=>(
          <div key={inv.id} style={{ background:'var(--white)', borderRadius:10, padding:12, marginBottom:6, boxShadow:'var(--shadow)', fontSize:13 }}>
            <div style={{ fontWeight:600 }}>{inv.template_name || inv.category}</div>
            <div style={{ fontSize:11, color:'var(--text2)' }}>👤 {inv.user_login} • 💬 {inv.response_count} javob • {inv.is_free?'Bepul':'Pullik'}</div>
            {inv.link&&<div style={{ fontSize:10, color:'var(--purple)', marginTop:4, wordBreak:'break-all' }}>{inv.link}</div>}
          </div>
        ))}</div>
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
