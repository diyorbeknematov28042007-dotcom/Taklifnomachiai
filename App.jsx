import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { T, catNames } from './lib/i18n';
import * as api from './lib/api';

// ==================== CONTEXT ====================
const AppContext = createContext();

function useApp() { return useContext(AppContext); }

// ==================== APP ====================
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
    } else {
      setLoading(false);
    }
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
          <Route path="/inv/:slug/*" element={<ViewInvPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/inv/:id" element={<ProfileInvPage />} />
          <Route path="/:slug/*" element={<ViewInvPage />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

// ==================== HEADER ====================
function Header({ toggleLang }) {
  const { t, user, navigate } = useApp();
  const loc = window.location.pathname;
  const isHome = loc === '/';

  return (
    <div className="hdr">
      <div className="hdr-left">
        {!isHome && (
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
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

// ==================== HOME ====================
function Home() {
  const { t, lang, navigate } = useApp();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    api.getTemplates().then(d => setTemplates(d.templates)).catch(() => {});
  }, []);

  const cats = [
    { key: 'wedding', icon: '💍', label: t.catWedding, sub: t.catWeddingSub },
    { key: 'birthday', icon: '🎂', label: t.catBirthday, sub: t.catBirthdaySub },
    { key: 'event', icon: '🔎', label: t.catEvent, sub: t.catEventSub },
    { key: 'love', icon: '❤️', label: t.catLove, sub: t.catLoveSub },
  ];

  return (
    <div>
      <div className="hero fu">
        <div className="hero-deco" />
        <div className="hero-title">{t.heroTitle}</div>
        <div className="hero-sub">{t.heroSub}</div>
      </div>

      <div className="search-bar fu fu1" onClick={() => navigate('/templates/wedding')}>
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </span>
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
        <div className="about-content">
          <h3>{t.aboutTitle}</h3>
          <p>{t.aboutText}</p>
        </div>
        <div className="about-img">📨</div>
      </div>

      <div className="feats fu fu4">
        {[{i:'⚡',t:t.feat1,s:t.feat1sub},{i:'📱',t:t.feat2,s:t.feat2sub},{i:'🔗',t:t.feat3,s:t.feat3sub},{i:'💬',t:t.feat4,s:t.feat4sub}].map((f,i) => (
          <div className="feat" key={i}>
            <div className="feat-icon">{f.i}</div>
            <div className="feat-text">{f.t}</div>
            <div className="feat-sub">{f.s}</div>
          </div>
        ))}
      </div>

      <div className="sec-hdr fu fu5">
        <div className="sec-title">{t.popularTemplates}</div>
        <Link to="/templates/wedding" className="sec-link">{t.viewAll} →</Link>
      </div>

      <div className="tpl-grid fu fu5">
        {templates.slice(0, 4).map(tp => (
          <TplCard key={tp.id} tp={tp} />
        ))}
      </div>
    </div>
  );
}

// ==================== TEMPLATE CARD ====================
function TplCard({ tp }) {
  const { t, lang, user, navigate } = useApp();
  const name = lang === 'uz' ? tp.name_uz : tp.name_ru;
  const tag = lang === 'uz' ? tp.tag_uz : tp.tag_ru;
  const sample = typeof tp.sample_data === 'string' ? JSON.parse(tp.sample_data) : tp.sample_data;

  return (
    <div className="tpl-card">
      <div className="tpl-thumb" style={{ background: tp.bg_style, color: tp.text_color }}>
        <span className={`tpl-badge ${tp.is_free ? 'free' : 'premium'}`}>
          {tp.is_free ? t.free : t.premium}
        </span>
        <button className="tpl-fav">
          <svg viewBox="0 0 20 20" fill="none"><path d="M10 17s-7-5-7-10a4 4 0 018 0 4 4 0 018 0c0 5-7 10-7 10z" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, marginTop:8, textShadow:"0 1px 6px rgba(0,0,0,0.15)", textAlign:'center' }}>
          {tp.category === 'wedding' && sample && `${sample.name1} & ${sample.name2}`}
          {tp.category === 'birthday' && sample?.person}
          {tp.category === 'event' && sample?.name}
          {tp.category === 'love' && sample?.text}
        </div>
        {tp.category === 'wedding' && sample?.date && <div style={{fontSize:10,opacity:.7,marginTop:4}}>{sample.date}</div>}
        {tp.category === 'birthday' && sample?.age && <div style={{fontSize:10,opacity:.7,marginTop:4}}>{sample.age}</div>}
      </div>
      <div className="tpl-info">
        <div className="tpl-name">{name}</div>
        <span className={`tpl-tag ${tp.category}`}>{tag}</span>
      </div>
      {!tp.is_free && <div className="tpl-price">{tp.price?.toLocaleString()} {t.price}</div>}
      <div className="tpl-actions">
        <button className="tpl-btn view" onClick={() => navigate(`/preview/${tp.id}`)}>
          👁 {t.preview}
        </button>
        <button className="tpl-btn make" onClick={() => {
          if (!user) navigate(`/auth?redirect=/create/${tp.category}/${tp.id}`);
          else navigate(`/create/${tp.category}/${tp.id}`);
        }}>
          ✨ {t.create}
        </button>
      </div>
    </div>
  );
}

// ==================== TEMPLATES PAGE ====================
function TemplatesPage() {
  const { cat } = useParams();
  const { t, lang } = useApp();
  const [tpls, setTpls] = useState([]);

  useEffect(() => {
    api.getTemplates(cat).then(d => setTpls(d.templates)).catch(() => {});
  }, [cat]);

  const cn = catNames(t);

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">{cn[cat]} — {t.selectTemplate}</div></div>
      <div className="tpl-grid">
        {tpls.map(tp => <TplCard key={tp.id} tp={tp} />)}
      </div>
    </div>
  );
}

// ==================== PREVIEW ====================
function PreviewPage() {
  const { id } = useParams();
  const { t, lang } = useApp();
  const [tpl, setTpl] = useState(null);

  useEffect(() => {
    api.getTemplate(id).then(d => setTpl(d.template)).catch(() => {});
  }, [id]);

  if (!tpl) return <div className="loading">{t.loading}</div>;

  const sample = typeof tpl.sample_data === 'string' ? JSON.parse(tpl.sample_data) : tpl.sample_data;
  const cn = catNames(t);

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'center', marginBottom: 12 }}>
        {lang === 'uz' ? tpl.name_uz : tpl.name_ru}
      </div>
      <div className="inv-full fu" style={{ background: tpl.bg_style, color: tpl.text_color }}>
        <div className="inv-cat-label">{cn[tpl.category]}</div>
        {tpl.category === 'wedding' && sample && (
          <>
            <div className="inv-names">{sample.name1}</div>
            <div className="inv-amp">&</div>
            <div className="inv-names">{sample.name2}</div>
            <div className="inv-line" style={{ background: tpl.text_color }} />
            <div className="inv-detail">📅 {sample.date}</div>
          </>
        )}
        {tpl.category === 'birthday' && sample && (
          <>
            <div className="inv-names">{sample.person}</div>
            <div style={{ fontSize: 16, opacity: .7, marginTop: 4 }}>{sample.age}</div>
          </>
        )}
        {tpl.category === 'event' && sample && (
          <>
            <div className="inv-names" style={{ fontSize: 26 }}>{sample.name}</div>
            <div className="inv-text">{sample.sub}</div>
            <div className="inv-detail">📅 {sample.date}</div>
            <div className="inv-detail">📍 {sample.loc}</div>
          </>
        )}
        {tpl.category === 'love' && sample && (
          <div className="inv-names">{sample.text}</div>
        )}
      </div>
    </div>
  );
}

// ==================== AUTH ====================
function AuthPage() {
  const { t, setUser, navigate } = useApp();
  const [mode, setMode] = useState('register');
  const [login, setLogin] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [sugs, setSugs] = useState([]);
  const [busy, setBusy] = useState(false);

  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';

  const submit = async () => {
    setErr(''); setSugs([]); setBusy(true);
    try {
      if (mode === 'login') {
        const d = await api.login(login, pw);
        setUser(d.user);
        navigate(redirect);
      } else {
        if (pw.length < 6) { setErr(t.passwordShort); setBusy(false); return; }
        if (pw !== pw2) { setErr(t.passwordMismatch); setBusy(false); return; }
        const d = await api.register(login, pw);
        setUser(d.user);
        navigate(redirect);
      }
    } catch (e) {
      setErr(e.message);
      if (e.suggestions) setSugs(e.suggestions);
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="form-card fu">
        <h2>{mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
        <div className="fg">
          <label>{t.login}</label>
          <input className="fi" value={login} onChange={e => setLogin(e.target.value)} placeholder={t.login} />
        </div>
        <div className="fg">
          <label>{t.password}</label>
          <input className="fi" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder={t.password} />
        </div>
        {mode === 'register' && (
          <div className="fg">
            <label>{t.confirmPassword}</label>
            <input className="fi" type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder={t.confirmPassword} />
          </div>
        )}
        {err && <div className="form-err">⚠️ {err}</div>}
        {sugs.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{t.suggestions}:</div>
            <div className="form-suggest">
              {sugs.map(s => <button key={s} className="suggest-chip" onClick={() => setLogin(s)}>{s}</button>)}
            </div>
          </div>
        )}
        <button className="main-btn" onClick={submit} disabled={busy}>
          {busy ? '...' : mode === 'login' ? t.loginBtn : t.registerBtn}
        </button>
        <div className="auth-sw">
          {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
          <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setErr(''); setSugs([]); }}>
            {mode === 'login' ? t.registerBtn : t.loginBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== FORM ====================
function FormPage() {
  const { cat, tplId } = useParams();
  const { t, navigate } = useApp();
  const [f, sF] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => sF(p => ({ ...p, [k]: v }));
  const cn = catNames(t);

  const fields = {
    wedding: [
      { k:'groomName', l:t.groomName },{ k:'brideName', l:t.brideName },
      { k:'mainText', l:t.mainText, ta:true },{ k:'date', l:t.date, type:'date' },
      { k:'time', l:t.time, type:'time' },{ k:'address', l:t.address },
      { k:'cardNumber', l:t.cardNumber, opt:true },
    ],
    birthday: [
      { k:'birthdayPerson', l:t.birthdayPerson },{ k:'birthdayDate', l:t.birthdayDate, type:'datetime-local' },
      { k:'birthdayText', l:t.birthdayText, ta:true },{ k:'birthdayAddress', l:t.birthdayAddress },
      { k:'birthdayExtra', l:t.birthdayExtra, opt:true },
    ],
    event: [
      { k:'eventName', l:t.eventName },{ k:'eventDesc', l:t.eventDesc, ta:true },
      { k:'time', l:t.time, type:'datetime-local' },{ k:'address', l:t.address },
      { k:'eventExtra', l:t.eventExtra, opt:true },
    ],
    love: [
      { k:'loveFrom', l:t.loveFrom },{ k:'loveTo', l:t.loveTo },
      { k:'loveText', l:t.loveText, ta:true },
    ],
  };

  const submit = async () => {
    setBusy(true); setErr('');
    try {
      const d = await api.createInvitation(tplId, cat, f);
      navigate(`/share/${d.invitation.uid}`);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="form-card fu">
        <h2 style={{ fontSize: 18 }}>{cn[cat]} — {t.fillInfo}</h2>
        {(fields[cat] || []).map(fld => (
          <div className="fg" key={fld.k}>
            <label>{fld.l} {fld.opt && <span style={{ opacity: .4, fontWeight: 400 }}>({t.optional})</span>}</label>
            {fld.ta
              ? <textarea className="fi" value={f[fld.k]||''} onChange={e => set(fld.k,e.target.value)} placeholder={fld.l} />
              : <input className="fi" type={fld.type||'text'} value={f[fld.k]||''} onChange={e => set(fld.k,e.target.value)} placeholder={fld.l} />
            }
          </div>
        ))}
        {err && <div className="form-err">⚠️ {err}</div>}
        <button className="main-btn" onClick={submit} disabled={busy}>
          {busy ? '...' : `✨ ${t.generateLink}`}
        </button>
      </div>
    </div>
  );
}

// ==================== SHARE ====================
function SharePage() {
  const { uid } = useParams();
  const { t } = useApp();
  const [inv, setInv] = useState(null);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCC] = useState(false);
  const [slug, setSlug] = useState('');
  const [paidLink, setPL] = useState('');

  useEffect(() => {
    fetch(`/api/invitations/${uid}`).then(r => r.json()).then(d => setInv(d.invitation)).catch(() => {});
  }, [uid]);

  if (!inv) return <div className="loading">{t.loading}</div>;

  const copy = (txt, fn) => {
    navigator.clipboard?.writeText(txt).then(() => { fn(true); setTimeout(() => fn(false), 2000); });
  };

  if (inv.is_free && inv.link) {
    return (
      <div className="share-card fu">
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h3>{t.readyTitle}</h3>
        <div className="sub">{t.readySub}</div>
        <div className="link-box">{inv.link}</div>
        <button className="copy-btn" onClick={() => copy(inv.link, setCopied)}>
          {copied ? `✅ ${t.copied}` : `📋 ${t.copyLink}`}
        </button>
        <div className="share-row">
          <button className="share-btn wa" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(inv.link)}`)}>
            💬 {t.shareWhatsapp}
          </button>
          <button className="share-btn tg" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}`)}>
            ✈️ {t.shareTelegram}
          </button>
        </div>
      </div>
    );
  }

  // Premium
  return (
    <div className="pay-card fu">
      <h3>🌟 {t.paymentTitle}</h3>
      <div className="pay-price">{inv.price?.toLocaleString()} {t.price}</div>
      <div className="pay-text">{t.paymentSub}</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>{t.yourCode}:</div>
      <div className="pay-code">{inv.payment_code}</div>
      <button className="copy-btn" style={{ margin: '12px auto' }} onClick={() => copy(inv.payment_code, setCC)}>
        {codeCopied ? `✅ ${t.copied}` : `📋 ${t.copyCode}`}
      </button>
      <div style={{ marginTop: 12 }}>
        <button className="bot-btn" onClick={() => window.open('https://t.me/taklifnomachi_bot')}>
          🤖 {t.goToBot}
        </button>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>{t.customLink}</label>
        <div style={{ fontSize: 11, color: 'var(--text2)', margin: '6px 0 8px' }}>{t.customLinkHint}</div>
        <div className="slug-row">
          <div className="slug-pre">{window.location.host}/</div>
          <input className="slug-inp" value={slug}
            onChange={e => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g,'').slice(0,20))} placeholder="my-event" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', margin: '6px 0 12px' }}>{t.afterPayment}</div>
        <button className="main-btn" disabled={slug.length < 5} onClick={async () => {
          try {
            const d = await api.setSlug(inv.id, slug);
            setPL(d.link);
          } catch(e) { alert(e.message); }
        }}>{t.createLink}</button>
        {paidLink && (
          <div style={{ marginTop: 12 }}>
            <div className="link-box">{paidLink}</div>
            <button className="copy-btn" style={{ marginTop: 8 }} onClick={() => copy(paidLink, setCopied)}>
              {copied ? `✅ ${t.copied}` : `📋 ${t.copyLink}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== VIEW INVITATION ====================
function ViewInvPage() {
  const { slug, '*': rest } = useParams();
  const fullSlug = rest ? `${slug}/${rest}` : slug;
  const { t, lang } = useApp();
  const [inv, setInv] = useState(null);
  const [rsvp, setRsvp] = useState('');
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.viewInvitation(fullSlug).then(d => setInv(d.invitation)).catch(() => {});
  }, [fullSlug]);

  if (!inv) return <div className="loading">{t.loading}</div>;

  const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
  const cn = catNames(t);
  const showRsvp = inv.category !== 'love';

  const send = async () => {
    try {
      await api.sendResponse(inv.id, rsvp || null, guests, msg, name);
      setSent(true);
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ padding: '0 20px 30px' }}>
      <div className="inv-full fu" style={{ background: inv.bg_style, color: inv.text_color }}>
        <div className="inv-cat-label">{cn[inv.category]}</div>
        {inv.category === 'wedding' && (
          <>
            <div className="inv-names">{d.groomName}</div>
            <div className="inv-amp">&</div>
            <div className="inv-names">{d.brideName}</div>
            <div className="inv-line" style={{ background: inv.text_color }} />
            <div className="inv-text">{d.mainText}</div>
            <div className="inv-detail">📅 {d.date}</div>
            <div className="inv-detail">🕐 {d.time}</div>
            <div className="inv-detail">📍 {d.address}</div>
            {d.cardNumber && <div className="inv-card-num">💳 {d.cardNumber}</div>}
          </>
        )}
        {inv.category === 'birthday' && (
          <>
            <div className="inv-names">{d.birthdayPerson}</div>
            <div className="inv-line" style={{ background: inv.text_color }} />
            <div className="inv-text">{d.birthdayText}</div>
            <div className="inv-detail">📅 {d.birthdayDate}</div>
            <div className="inv-detail">📍 {d.birthdayAddress}</div>
          </>
        )}
        {inv.category === 'event' && (
          <>
            <div className="inv-names" style={{ fontSize: 26 }}>{d.eventName}</div>
            <div className="inv-line" style={{ background: inv.text_color }} />
            <div className="inv-text">{d.eventDesc}</div>
            <div className="inv-detail">📅 {d.time}</div>
            <div className="inv-detail">📍 {d.address}</div>
          </>
        )}
        {inv.category === 'love' && (
          <>
            <div style={{ fontSize: 14, opacity: .6 }}>{d.loveFrom}</div>
            <div style={{ fontSize: 48, margin: '12px 0' }}>❤️</div>
            <div style={{ fontSize: 14, opacity: .6 }}>{d.loveTo}</div>
            <div className="inv-line" style={{ background: inv.text_color }} />
            <div className="inv-text">{d.loveText}</div>
          </>
        )}

        {/* RESPONSE */}
        <div style={{ marginTop:28, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.15)', width:'100%' }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:16, textAlign:'center' }}>{t.sendResponse}</div>
          {sent ? (
            <div style={{ textAlign:'center', padding:20, opacity:.8 }}>✅ {t.responseSent}</div>
          ) : (
            <>
              <input style={{ width:'100%', padding:10, borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'inherit', fontFamily:'Inter,sans-serif', fontSize:13, marginBottom:10, outline:'none' }}
                placeholder={t.yourName} value={name} onChange={e => setName(e.target.value)} />
              {showRsvp && (
                <>
                  <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12 }}>
                    {['attending','notAttending','maybe'].map(o => (
                      <button key={o} onClick={() => setRsvp(o)}
                        style={{ padding:'8px 14px', borderRadius:10, fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${rsvp===o?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.2)'}`, background:rsvp===o?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.05)', color:'inherit' }}>
                        {t[o]}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:12 }}>
                    <span style={{ fontSize:13, opacity:.7 }}>{t.guestCount}:</span>
                    <input type="number" min="1" max="20" value={guests} onChange={e => setGuests(+e.target.value)}
                      style={{ width:56, padding:8, textAlign:'center', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'inherit', fontFamily:'Inter,sans-serif', outline:'none' }} />
                  </div>
                </>
              )}
              <textarea placeholder={t.responsePlaceholder} value={msg} onChange={e => setMsg(e.target.value)}
                style={{ width:'100%', padding:12, borderRadius:10, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'inherit', fontFamily:'Inter,sans-serif', fontSize:13, minHeight:60, resize:'none', outline:'none', marginBottom:12 }} />
              <button onClick={send}
                style={{ width:'100%', padding:12, border:'none', borderRadius:10, background:'rgba(255,255,255,0.2)', fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer', color:'inherit' }}>
                ✈️ {t.send}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== PROFILE ====================
function ProfilePage() {
  const { t, lang, user, logout, navigate } = useApp();
  const [invs, setInvs] = useState([]);

  useEffect(() => {
    if (user) api.getMyInvitations().then(d => setInvs(d.invitations)).catch(() => {});
  }, [user]);

  if (!user) return <div className="loading">{t.loading}</div>;

  const cn = catNames(t);
  const getTitle = (inv) => {
    const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
    if (inv.category === 'wedding') return `${d.groomName||''} & ${d.brideName||''}`;
    if (inv.category === 'birthday') return d.birthdayPerson || '';
    if (inv.category === 'event') return d.eventName || '';
    return `${d.loveFrom||''} ❤️ ${d.loveTo||''}`;
  };

  return (
    <div>
      <div className="prof-hdr fu">
        <div className="prof-avatar">{user.login[0]?.toUpperCase()}</div>
        <div className="prof-name">{user.login}</div>
        <div className="prof-id">{t.yourId}: {user.uid}</div>
      </div>
      <div style={{ fontSize:16, fontWeight:700, padding:'0 20px', marginBottom:12 }}>{t.myInvitations}</div>
      {invs.length === 0 ? (
        <div style={{ textAlign:'center', color:'var(--text2)', padding:'30px 20px', fontSize:13 }}>{t.noInvitations}</div>
      ) : invs.map(inv => (
        <div key={inv.id} className="inv-item" onClick={() => navigate(`/profile/inv/${inv.id}`)}>
          <div className="inv-item-type">{cn[inv.category]}</div>
          <div className="inv-item-title">{getTitle(inv)}</div>
          <div className="inv-item-date">{t.createdAt}: {new Date(inv.created_at).toLocaleDateString()}</div>
          {inv.response_count > 0 && <div className="inv-item-resp">💬 {inv.response_count} {t.responses}</div>}
        </div>
      ))}
      <button className="logout-btn" onClick={logout}>{t.logout}</button>
    </div>
  );
}

// ==================== PROFILE INV DETAIL ====================
function ProfileInvPage() {
  const { id } = useParams();
  const { t, lang } = useApp();
  const [inv, setInv] = useState(null);
  const [resps, setResps] = useState([]);

  useEffect(() => {
    fetch(`/api/invitations/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('tkn_token')}` } })
      .then(r => r.json()).then(d => {
        setInv(d.invitation);
        return api.getResponses(d.invitation.id);
      }).then(d => setResps(d.responses)).catch(() => {});
  }, [id]);

  if (!inv) return <div className="loading">{t.loading}</div>;

  const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
  const cn = catNames(t);
  const title = inv.category === 'wedding' ? `${d.groomName} & ${d.brideName}`
    : inv.category === 'birthday' ? d.birthdayPerson
    : inv.category === 'event' ? d.eventName
    : `${d.loveFrom} → ${d.loveTo}`;

  return (
    <div style={{ padding: '16px 20px' }}>
      <div className="form-card fu" style={{ marginBottom: 16 }}>
        <div style={{ fontSize:11, color:'var(--purple)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>
          {cn[inv.category]}
        </div>
        <div style={{ fontSize:18, fontWeight:700, marginTop:6 }}>{title}</div>
        {inv.link && <div className="link-box" style={{ marginTop:12, fontSize:11 }}>{inv.link}</div>}
      </div>
      <div style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>💬 {t.responses} ({resps.length})</div>
      {resps.length === 0 ? (
        <div style={{ textAlign:'center', color:'var(--text2)', padding:20, fontSize:13 }}>{t.noResponses}</div>
      ) : resps.map(r => (
        <div key={r.id} className="inv-item" style={{ margin:'0 0 10px' }}>
          {r.sender_name && <div style={{ fontSize:13, fontWeight:600 }}>{r.sender_name}</div>}
          {r.rsvp && (
            <div style={{ fontSize:12, fontWeight:700, color: r.rsvp==='attending'?'var(--green)':r.rsvp==='notAttending'?'var(--red)':'var(--orange)', marginTop:4 }}>
              {t[r.rsvp]} {r.guest_count > 1 && `(${r.guest_count} ${lang==='uz'?'kishi':'чел.'})`}
            </div>
          )}
          {r.message && <div style={{ fontSize:14, marginTop:6 }}>{r.message}</div>}
          <div style={{ fontSize:11, color:'var(--text2)', marginTop:6 }}>{new Date(r.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
