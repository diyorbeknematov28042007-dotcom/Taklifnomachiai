import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-2026';
const PORT = process.env.PORT || 3001;
const SITE_URL = process.env.SITE_URL || 'https://taklifnomachiai.onrender.com';

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try { await sql`SELECT 1`; res.json({ status:'ok', db:'connected', url: SITE_URL }); }
  catch(e) { res.json({ status:'ok', db:'error:'+e.message, url: SITE_URL }); }
});

app.use(express.static(path.join(__dirname, 'dist')));

function generateUID() { return String(Math.floor(100000 + Math.random() * 900000)); }
function generateSlugID() { return String(Math.floor(10000 + Math.random() * 90000)); }
function transliterate(s) {
  const m={"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ъ":"","ы":"i","ь":"","э":"e","ю":"yu","я":"ya","ў":"o","қ":"q","ғ":"g","ҳ":"h","'":"","ʻ":""};
  return s.toLowerCase().split("").map(c=>m[c]||c).join("").replace(/[^a-z0-9-]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error:'Token kerak' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error:'Token yaroqsiz' }); }
}
function adminMiddleware(req, res, next) {
  const k = req.headers['x-admin-key'];
  if (k !== ADMIN_SECRET) return res.status(403).json({ error:'Admin ruxsati yoq' });
  next();
}

// AUTH
app.post('/api/auth/register', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login||!password) return res.status(400).json({ error:'Login va parol kerak' });
    if (password.length<6) return res.status(400).json({ error:'Parol kamida 6 belgi', code:'PASSWORD_SHORT' });
    const existing = await sql`SELECT id FROM users WHERE login=${login}`;
    if (existing.length>0) return res.status(409).json({ error:'Login band', code:'LOGIN_TAKEN', suggestions:[login+Math.floor(Math.random()*999), login+'_'+Math.floor(Math.random()*99), login+'.'+new Date().getFullYear()] });
    const uid=generateUID(), ph=await bcrypt.hash(password,10);
    const r=await sql`INSERT INTO users(uid,login,password_hash) VALUES(${uid},${login},${ph}) RETURNING id,uid,login,created_at`;
    const u=r[0], token=jwt.sign({id:u.id,uid:u.uid,login:u.login},JWT_SECRET,{expiresIn:'30d'});
    res.json({ user:{id:u.id,uid:u.uid,login:u.login}, token });
  } catch(e) { console.error('Register:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const us=await sql`SELECT * FROM users WHERE login=${login}`;
    if(us.length===0) return res.status(401).json({error:'Login yoki parol notogri'});
    const u=us[0], valid=await bcrypt.compare(password,u.password_hash);
    if(!valid) return res.status(401).json({error:'Login yoki parol notogri'});
    const token=jwt.sign({id:u.id,uid:u.uid,login:u.login},JWT_SECRET,{expiresIn:'30d'});
    res.json({ user:{id:u.id,uid:u.uid,login:u.login}, token });
  } catch(e) { console.error('Login:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const r=await sql`SELECT id,uid,login,created_at FROM users WHERE id=${req.user.id}`;
    if(r.length===0) return res.status(404).json({error:'Topilmadi'});
    res.json({ user:r[0] });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// TEMPLATES
app.get('/api/templates', async (req, res) => {
  try {
    const {category}=req.query;
    const r = category
      ? await sql`SELECT * FROM templates WHERE is_active=true AND category=${category} ORDER BY sort_order`
      : await sql`SELECT * FROM templates WHERE is_active=true ORDER BY sort_order`;
    res.json({ templates:r });
  } catch(e) { console.error('Templates:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const r=await sql`SELECT * FROM templates WHERE id=${req.params.id}`;
    if(r.length===0) return res.status(404).json({error:'Topilmadi'});
    res.json({ template:r[0] });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// INVITATIONS
app.post('/api/invitations', authMiddleware, async (req, res) => {
  try {
    const {templateId, category, data, customSlug}=req.body;
    const uid=generateSlugID();
    const tpls=await sql`SELECT * FROM templates WHERE id=${templateId}`;
    if(tpls.length===0) return res.status(404).json({error:'Shablon topilmadi'});
    const tpl=tpls[0];
    let slug, link; const isFree=tpl.is_free;
    if(isFree) {
      let names='';
      if(category==='wedding') names=transliterate((data.groomName||'')+'-'+(data.brideName||''));
      else if(category==='birthday') names=transliterate(data.birthdayPerson||'');
      else if(category==='love') names=transliterate((data.loveFrom||'')+'-'+(data.loveTo||''));
      else names=transliterate(data.eventName||'');
      slug=`${category}-${names}-${uid}`;
      link=`${SITE_URL}/v/${slug}`;
    } else if(customSlug) {
      const ex=await sql`SELECT id FROM invitations WHERE slug=${customSlug}`;
      if(ex.length>0) return res.status(409).json({error:'Bu slug band'});
      slug=customSlug;
    }
    const paymentCode=!isFree?generateUID():null;
    const r=await sql`INSERT INTO invitations(uid,user_id,template_id,category,data,slug,link,is_free,price,payment_code) VALUES(${uid},${req.user.id},${templateId},${category},${JSON.stringify(data)},${slug},${link},${isFree},${tpl.price},${paymentCode}) RETURNING *`;
    const inv=r[0];
    if(!isFree&&paymentCode) await sql`INSERT INTO payments(user_id,invitation_id,code,amount) VALUES(${req.user.id},${inv.id},${paymentCode},${tpl.price})`;
    res.json({ invitation:inv, paymentCode });
  } catch(e) { console.error('Create inv:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.get('/api/invitations/my', authMiddleware, async (req, res) => {
  try {
    const r=await sql`SELECT i.*,t.name_uz as template_name_uz,t.name_ru as template_name_ru,(SELECT COUNT(*) FROM responses r WHERE r.invitation_id=i.id) as response_count FROM invitations i LEFT JOIN templates t ON i.template_id=t.id WHERE i.user_id=${req.user.id} ORDER BY i.created_at DESC`;
    res.json({ invitations:r });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// Slug bo'yicha ko'rish (public)
app.get('/api/invitations/by-slug/:slug', async (req, res) => {
  try {
    const r=await sql`SELECT i.*,t.bg_style,t.accent_color,t.text_color,t.decoration,t.name_uz as template_name_uz,t.name_ru as template_name_ru FROM invitations i LEFT JOIN templates t ON i.template_id=t.id WHERE i.slug=${req.params.slug}`;
    if(r.length===0) return res.status(404).json({error:'Taklifnoma topilmadi'});
    res.json({ invitation:r[0] });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// UID bo'yicha
app.get('/api/invitations/:uid', async (req, res) => {
  try {
    const r=await sql`SELECT i.*,t.bg_style,t.accent_color,t.text_color,t.decoration FROM invitations i LEFT JOIN templates t ON i.template_id=t.id WHERE i.uid=${req.params.uid}`;
    if(r.length===0) return res.status(404).json({error:'Topilmadi'});
    res.json({ invitation:r[0] });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// RESPONSES
app.post('/api/responses', async (req, res) => {
  try {
    const {invitationId,rsvp,guestCount,message,senderName}=req.body;
    const r=await sql`INSERT INTO responses(invitation_id,rsvp,guest_count,message,sender_name) VALUES(${invitationId},${rsvp||null},${guestCount||1},${message||''},${senderName||''}) RETURNING *`;
    res.json({ response:r[0] });
  } catch(e) { console.error('Response:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.get('/api/responses/:invitationId', authMiddleware, async (req, res) => {
  try {
    const r=await sql`SELECT * FROM responses WHERE invitation_id=${req.params.invitationId} ORDER BY created_at DESC`;
    res.json({ responses:r });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// PAYMENTS
app.post('/api/payments/verify', async (req, res) => {
  try {
    const {code,telegramId}=req.body;
    const p=await sql`SELECT * FROM payments WHERE code=${code} AND status='pending'`;
    if(p.length===0) return res.status(404).json({error:'Tolov topilmadi'});
    const pay=p[0];
    await sql`UPDATE payments SET status='paid',telegram_id=${telegramId},paid_at=NOW() WHERE id=${pay.id}`;
    await sql`UPDATE invitations SET is_paid=true WHERE id=${pay.invitation_id}`;
    if(telegramId) await sql`UPDATE users SET telegram_id=${telegramId} WHERE id=${pay.user_id}`;
    res.json({ success:true });
  } catch(e) { console.error('Payment:',e); res.status(500).json({error:'Server xatosi'}); }
});

app.post('/api/invitations/set-slug', authMiddleware, async (req, res) => {
  try {
    const {invitationId,customSlug}=req.body;
    const inv=await sql`SELECT * FROM invitations WHERE id=${invitationId} AND user_id=${req.user.id}`;
    if(inv.length===0) return res.status(404).json({error:'Topilmadi'});
    if(!inv[0].is_paid&&!inv[0].is_free) return res.status(400).json({error:'Avval tolov qiling'});
    const ex=await sql`SELECT id FROM invitations WHERE slug=${customSlug} AND id!=${invitationId}`;
    if(ex.length>0) return res.status(409).json({error:'Bu slug band'});
    const link=`${SITE_URL}/v/${customSlug}`;
    await sql`UPDATE invitations SET slug=${customSlug},link=${link} WHERE id=${invitationId}`;
    res.json({ link, slug:customSlug });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// ADMIN
app.get('/api/admin/templates', adminMiddleware, async (req, res) => {
  try { const r=await sql`SELECT * FROM templates ORDER BY sort_order`; res.json({templates:r}); }
  catch(e) { res.status(500).json({error:'Server xatosi'}); }
});
app.post('/api/admin/templates', adminMiddleware, async (req, res) => {
  try {
    const {id,category,name_uz,name_ru,tag_uz,tag_ru,is_free,price,bg_style,accent_color,text_color,decoration,sample_data,sort_order}=req.body;
    const r=await sql`INSERT INTO templates(id,category,name_uz,name_ru,tag_uz,tag_ru,is_free,price,bg_style,accent_color,text_color,decoration,sample_data,sort_order) VALUES(${id},${category},${name_uz},${name_ru},${tag_uz||''},${tag_ru||''},${is_free!==false},${price||0},${bg_style||''},${accent_color||'#fff'},${text_color||'#000'},${decoration||''},${JSON.stringify(sample_data||{})},${sort_order||0}) RETURNING *`;
    res.json({ template:r[0] });
  } catch(e) { console.error('Admin tpl create:',e); res.status(500).json({error:'Server xatosi'}); }
});
app.put('/api/admin/templates/:id', adminMiddleware, async (req, res) => {
  try {
    const b=req.body;
    const r=await sql`UPDATE templates SET name_uz=COALESCE(${b.name_uz},name_uz),name_ru=COALESCE(${b.name_ru},name_ru),tag_uz=COALESCE(${b.tag_uz},tag_uz),tag_ru=COALESCE(${b.tag_ru},tag_ru),is_free=COALESCE(${b.is_free},is_free),price=COALESCE(${b.price},price),bg_style=COALESCE(${b.bg_style},bg_style),accent_color=COALESCE(${b.accent_color},accent_color),text_color=COALESCE(${b.text_color},text_color),decoration=COALESCE(${b.decoration},decoration),sample_data=COALESCE(${b.sample_data?JSON.stringify(b.sample_data):null},sample_data),sort_order=COALESCE(${b.sort_order},sort_order),is_active=COALESCE(${b.is_active},is_active) WHERE id=${req.params.id} RETURNING *`;
    if(r.length===0) return res.status(404).json({error:'Topilmadi'});
    res.json({ template:r[0] });
  } catch(e) { console.error('Admin tpl update:',e); res.status(500).json({error:'Server xatosi'}); }
});
app.delete('/api/admin/templates/:id', adminMiddleware, async (req, res) => {
  try { await sql`DELETE FROM templates WHERE id=${req.params.id}`; res.json({success:true}); }
  catch(e) { res.status(500).json({error:'Server xatosi'}); }
});
app.get('/api/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const u=await sql`SELECT COUNT(*) as c FROM users`;
    const i=await sql`SELECT COUNT(*) as c FROM invitations`;
    const r=await sql`SELECT COUNT(*) as c FROM responses`;
    const p=await sql`SELECT COUNT(*) as c FROM payments WHERE status='paid'`;
    const rev=await sql`SELECT COALESCE(SUM(amount),0) as t FROM payments WHERE status='paid'`;
    res.json({ users:+u[0].c, invitations:+i[0].c, responses:+r[0].c, paidPayments:+p[0].c, revenue:+rev[0].t });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});
app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  try { const r=await sql`SELECT id,uid,login,telegram_id,created_at FROM users ORDER BY created_at DESC LIMIT 100`; res.json({users:r}); }
  catch(e) { res.status(500).json({error:'Server xatosi'}); }
});
app.get('/api/admin/invitations', adminMiddleware, async (req, res) => {
  try {
    const r=await sql`SELECT i.*,u.login as user_login,t.name_uz as template_name,(SELECT COUNT(*) FROM responses r WHERE r.invitation_id=i.id) as response_count FROM invitations i LEFT JOIN users u ON i.user_id=u.id LEFT JOIN templates t ON i.template_id=t.id ORDER BY i.created_at DESC LIMIT 100`;
    res.json({ invitations:r });
  } catch(e) { res.status(500).json({error:'Server xatosi'}); }
});

// SPA FALLBACK
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'dist', 'index.html')); });
app.listen(PORT, () => { console.log('🚀 Taklifnomachi server: http://localhost:'+PORT); });
