import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Neon serverless optimizatsiya — CPU hours tejash
neonConfig.fetchConnectionCache = true;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ==================== CONFIG & VALIDATION ====================
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-2026';
const PORT = process.env.PORT || 3001;
const SITE_URL = (process.env.SITE_URL || 'https://taklifnomachiai.onrender.com').replace(/\/+$/, '');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

// Startup checks
if (!DATABASE_URL) { console.error('❌ DATABASE_URL env kerak!'); process.exit(1); }
if (!JWT_SECRET && IS_PROD) { console.error('❌ JWT_SECRET env kerak (production)!'); process.exit(1); }

const sql = neon(DATABASE_URL);
const SECRET = JWT_SECRET || 'dev-secret-only';

// ==================== APP SETUP ====================
const app = express();

// Trust Render proxy (for rate limiting & HTTPS)
app.set('trust proxy', 1);

// HTTPS redirect (production only)
if (IS_PROD) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (IS_PROD) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(cors({ origin: IS_PROD ? SITE_URL : '*' }));
app.use(express.json({ limit: '10mb' }));

// Static files (React build)
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: IS_PROD ? '7d' : 0,
  etag: true,
}));

// ==================== RATE LIMITING (in-memory) ====================
const rateLimits = new Map();
function rateLimit(windowMs, maxReqs) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimits.get(key);
    if (record && now - record.start < windowMs) {
      record.count++;
      if (record.count > maxReqs) {
        return res.status(429).json({ error: 'Juda ko\'p so\'rovlar. Biroz kuting.' });
      }
    } else {
      rateLimits.set(key, { start: now, count: 1 });
    }
    next();
  };
}
// Cleanup every 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimits) {
    if (now - val.start > 300000) rateLimits.delete(key);
  }
}, 300000);

// ==================== LOGGING ====================
function logError(context, err) {
  console.error(`[${new Date().toISOString()}] [${context}]`, err.message || err);
}

// ==================== HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
  try {
    const start = Date.now();
    await sql`SELECT 1`;
    const dbMs = Date.now() - start;
    res.json({
      status: 'ok', db: 'connected', dbLatency: dbMs + 'ms',
      url: SITE_URL, env: NODE_ENV, uptime: Math.floor(process.uptime()) + 's'
    });
  } catch (e) {
    logError('health', e);
    res.status(503).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

// ==================== HELPERS ====================
function generateUID() { return String(Math.floor(100000 + Math.random() * 900000)); }
function generateSlugID() { return String(Math.floor(10000 + Math.random() * 90000)); }

function transliterate(s) {
  const m = {"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ъ":"","ы":"i","ь":"","э":"e","ю":"yu","я":"ya","ў":"o","қ":"q","ғ":"g","ҳ":"h","'":"","ʻ":""};
  return s.toLowerCase().split("").map(c => m[c] || c).join("")
    .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function sanitize(str, maxLen = 200) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

function validateLogin(login) {
  if (!login || login.length < 3 || login.length > 30) return 'Login 3-30 belgi bo\'lishi kerak';
  if (!/^[a-zA-Z0-9._-]+$/.test(login)) return 'Login faqat lotin harflari, raqamlar, ., _ va - bo\'lishi mumkin';
  return null;
}

// ==================== AUTH MIDDLEWARE ====================
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Token kerak' });
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token yaroqsiz yoki muddati o\'tgan' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.headers['x-admin-key'] !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Admin ruxsati yo\'q' });
  }
  next();
}

// ==================== AUTH ====================
const authLimiter = rateLimit(60000, 10); // 10 req/min per IP

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const login = sanitize(req.body.login, 30);
    const password = req.body.password;

    const loginErr = validateLogin(login);
    if (loginErr) return res.status(400).json({ error: loginErr });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Parol kamida 6 belgi', code: 'PASSWORD_SHORT' });
    if (password.length > 100) return res.status(400).json({ error: 'Parol juda uzun' });

    const existing = await sql`SELECT id FROM users WHERE login = ${login}`;
    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Login band', code: 'LOGIN_TAKEN',
        suggestions: [login + Math.floor(Math.random() * 999), login + '_' + Math.floor(Math.random() * 99)]
      });
    }

    const uid = generateUID();
    const hash = await bcrypt.hash(password, 10);
    const r = await sql`INSERT INTO users (uid, login, password_hash) VALUES (${uid}, ${login}, ${hash}) RETURNING id, uid, login, created_at`;
    const u = r[0];
    const token = jwt.sign({ id: u.id, uid: u.uid, login: u.login }, SECRET, { expiresIn: '30d' });
    res.json({ user: { id: u.id, uid: u.uid, login: u.login }, token });
  } catch (e) {
    logError('register', e);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const login = sanitize(req.body.login, 30);
    const password = req.body.password;
    if (!login || !password) return res.status(400).json({ error: 'Login va parol kerak' });

    const users = await sql`SELECT * FROM users WHERE login = ${login}`;
    if (users.length === 0) return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });

    const u = users[0];
    const valid = await bcrypt.compare(password, u.password_hash);
    if (!valid) return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });

    const token = jwt.sign({ id: u.id, uid: u.uid, login: u.login }, SECRET, { expiresIn: '30d' });
    res.json({ user: { id: u.id, uid: u.uid, login: u.login }, token });
  } catch (e) {
    logError('login', e);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const r = await sql`SELECT id, uid, login, created_at FROM users WHERE id = ${req.user.id}`;
    if (r.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ user: r[0] });
  } catch (e) { logError('me', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== TEMPLATES ====================
app.get('/api/templates', async (req, res) => {
  try {
    const { category } = req.query;
    const r = category
      ? await sql`SELECT * FROM templates WHERE is_active = true AND category = ${category} ORDER BY sort_order`
      : await sql`SELECT * FROM templates WHERE is_active = true ORDER BY sort_order`;
    res.json({ templates: r });
  } catch (e) { logError('templates', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const r = await sql`SELECT * FROM templates WHERE id = ${sanitize(req.params.id, 10)}`;
    if (r.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ template: r[0] });
  } catch (e) { logError('template', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== INVITATIONS ====================
const createLimiter = rateLimit(60000, 5); // 5 creates/min

app.post('/api/invitations', authMiddleware, createLimiter, async (req, res) => {
  try {
    const { templateId, category, data, customSlug } = req.body;
    if (!templateId || !category || !data) return res.status(400).json({ error: 'templateId, category va data kerak' });

    const uid = generateSlugID();
    const tpls = await sql`SELECT * FROM templates WHERE id = ${sanitize(templateId, 10)}`;
    if (tpls.length === 0) return res.status(404).json({ error: 'Shablon topilmadi' });
    const tpl = tpls[0];

    let slug = null, link = null;
    const isFree = tpl.is_free;

    if (isFree) {
      let names = '';
      if (category === 'wedding') names = transliterate((data.groomName || '') + '-' + (data.brideName || ''));
      else if (category === 'birthday') names = transliterate(data.birthdayPerson || '');
      else if (category === 'love') names = transliterate((data.loveFrom || '') + '-' + (data.loveTo || ''));
      else names = transliterate(data.eventName || '');
      slug = `${category}-${names}-${uid}`.slice(0, 90);
      link = `${SITE_URL}/v/${slug}`;
    }
    // Premium — slug va link yo'q, foydalanuvchi to'lovdan keyin o'zi tanlaydi

    const paymentCode = !isFree ? generateUID() : null;
    const dataStr = JSON.stringify(data);
    if (dataStr.length > 10000) return res.status(400).json({ error: 'Ma\'lumotlar juda katta' });

    const r = await sql`
      INSERT INTO invitations (uid, user_id, template_id, category, data, slug, link, is_free, price, payment_code)
      VALUES (${uid}, ${req.user.id}, ${templateId}, ${category}, ${dataStr}, ${slug}, ${link}, ${isFree}, ${tpl.price}, ${paymentCode})
      RETURNING *`;
    const inv = r[0];

    if (!isFree && paymentCode) {
      await sql`INSERT INTO payments (user_id, invitation_id, code, amount) VALUES (${req.user.id}, ${inv.id}, ${paymentCode}, ${tpl.price})`;
    }

    res.json({ invitation: inv, paymentCode });
  } catch (e) { logError('createInv', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/invitations/my', authMiddleware, async (req, res) => {
  try {
    const r = await sql`
      SELECT i.*, t.name_uz as template_name_uz, t.name_ru as template_name_ru,
        (SELECT COUNT(*) FROM responses r WHERE r.invitation_id = i.id) as response_count
      FROM invitations i LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.user_id = ${req.user.id} ORDER BY i.created_at DESC LIMIT 50`;
    res.json({ invitations: r });
  } catch (e) { logError('myInv', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// Public: slug bo'yicha ko'rish
app.get('/api/invitations/by-slug/:slug', async (req, res) => {
  try {
    const slug = sanitize(req.params.slug, 100);
    const r = await sql`
      SELECT i.*, t.bg_style, t.accent_color, t.text_color, t.decoration,
        t.name_uz as template_name_uz, t.name_ru as template_name_ru
      FROM invitations i LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.slug = ${slug}`;
    if (r.length === 0) return res.status(404).json({ error: 'Taklifnoma topilmadi' });

    // View count (fire and forget)
    sql`UPDATE invitations SET views = COALESCE(views, 0) + 1 WHERE slug = ${slug}`.catch(() => {});

    res.json({ invitation: r[0] });
  } catch (e) { logError('bySlug', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// UID bo'yicha
app.get('/api/invitations/:uid', async (req, res) => {
  try {
    const r = await sql`
      SELECT i.*, t.bg_style, t.accent_color, t.text_color, t.decoration
      FROM invitations i LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.uid = ${sanitize(req.params.uid, 10)}`;
    if (r.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ invitation: r[0] });
  } catch (e) { logError('invByUid', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== RESPONSES ====================
const responseLimiter = rateLimit(60000, 10);

app.post('/api/responses', responseLimiter, async (req, res) => {
  try {
    const { invitationId, rsvp, guestCount, message, senderName } = req.body;
    if (!invitationId) return res.status(400).json({ error: 'invitationId kerak' });
    if (rsvp && !['attending', 'notAttending', 'maybe'].includes(rsvp)) {
      return res.status(400).json({ error: 'rsvp noto\'g\'ri' });
    }
    const gc = Math.min(Math.max(parseInt(guestCount) || 1, 1), 50);
    const r = await sql`
      INSERT INTO responses (invitation_id, rsvp, guest_count, message, sender_name)
      VALUES (${invitationId}, ${rsvp || null}, ${gc}, ${sanitize(message, 500)}, ${sanitize(senderName, 100)})
      RETURNING *`;
    res.json({ response: r[0] });
  } catch (e) { logError('response', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/responses/:invitationId', authMiddleware, async (req, res) => {
  try {
    const r = await sql`SELECT * FROM responses WHERE invitation_id = ${req.params.invitationId} ORDER BY created_at DESC`;
    res.json({ responses: r });
  } catch (e) { logError('responses', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== PAYMENTS ====================

// GET /api/payments/card — aktiv kartani olish (public)
app.get('/api/payments/card', async (req, res) => {
  try {
    const r = await sql`
      SELECT id, card_number, card_owner, card_type
      FROM payment_cards WHERE is_active = true
      ORDER BY created_at DESC LIMIT 1`;
    if (r.length === 0) return res.status(404).json({ error: 'Karta topilmadi' });
    res.json(r[0]);
  } catch (e) { logError('payCard', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// POST /api/payments/card — yangi karta qo'shish (admin)
app.post('/api/payments/card', adminMiddleware, async (req, res) => {
  try {
    const { card_number, card_owner, card_type } = req.body;
    if (!card_number || !card_owner || !card_type)
      return res.status(400).json({ error: 'card_number, card_owner, card_type kerak' });
    const validTypes = ['HUMO', 'UzCard', 'Visa', 'MasterCard'];
    if (!validTypes.includes(card_type))
      return res.status(400).json({ error: 'card_type: HUMO, UzCard, Visa yoki MasterCard' });
    await sql`UPDATE payment_cards SET is_active = false`;
    const r = await sql`
      INSERT INTO payment_cards (card_number, card_owner, card_type, is_active)
      VALUES (${sanitize(card_number, 25)}, ${sanitize(card_owner, 100)}, ${card_type}, true)
      RETURNING *`;
    res.json(r[0]);
  } catch (e) { logError('payCardCreate', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// GET /api/payments/card/all — barcha kartalar (admin)
app.get('/api/payments/card/all', adminMiddleware, async (req, res) => {
  try {
    const r = await sql`SELECT * FROM payment_cards ORDER BY created_at DESC`;
    res.json({ cards: r });
  } catch (e) { logError('payCardAll', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// DELETE /api/payments/card/:id — kartani o'chirish (admin)
app.delete('/api/payments/card/:id', adminMiddleware, async (req, res) => {
  try {
    await sql`DELETE FROM payment_cards WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (e) { logError('payCardDel', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// POST /api/payments/upload — screenshot yuklash + avto-tasdiqlash
const uploadLimiter = rateLimit(60000, 5);
app.post('/api/payments/upload', authMiddleware, uploadLimiter, upload.single('screenshot'), async (req, res) => {
  try {
    const { invitation_uid } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Screenshot kerak' });
    if (!invitation_uid) return res.status(400).json({ error: 'invitation_uid kerak' });

    const invR = await sql`
      SELECT id, user_id, is_free, is_paid FROM invitations
      WHERE uid = ${sanitize(invitation_uid, 10)}`;
    if (invR.length === 0) return res.status(404).json({ error: 'Taklifnoma topilmadi' });
    const inv = invR[0];

    if (inv.user_id !== req.user.id) return res.status(403).json({ error: 'Ruxsat yo\'q' });
    if (inv.is_free) return res.status(400).json({ error: 'Bu taklifnoma bepul' });
    if (inv.is_paid) return res.status(400).json({ error: 'Allaqachon to\'langan' });

    const base64Full = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const payR = await sql`SELECT id FROM payments WHERE invitation_id = ${inv.id} LIMIT 1`;
    if (payR.length > 0) {
      await sql`UPDATE payments SET screenshot_base64 = ${base64Full}, status = 'paid', paid_at = NOW() WHERE id = ${payR[0].id}`;
    } else {
      await sql`
        INSERT INTO payments (user_id, invitation_id, code, amount, status, screenshot_base64, paid_at)
        VALUES (${req.user.id}, ${inv.id}, ${generateUID()}, 0, 'paid', ${base64Full}, NOW())`;
    }
    await sql`UPDATE invitations SET is_paid = true WHERE id = ${inv.id}`;
    res.json({ success: true, message: 'To\'lov tasdiqlandi!' });
  } catch (e) { logError('payUpload', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// GET /api/payments/status/:uid — to'lov holatini tekshirish
app.get('/api/payments/status/:uid', authMiddleware, async (req, res) => {
  try {
    const r = await sql`
      SELECT p.status, p.paid_at, i.is_paid, i.slug, i.link
      FROM payments p JOIN invitations i ON i.id = p.invitation_id
      WHERE i.uid = ${sanitize(req.params.uid, 10)} AND i.user_id = ${req.user.id}
      ORDER BY p.created_at DESC LIMIT 1`;
    if (r.length === 0) return res.json({ status: 'not_found', is_paid: false });
    res.json(r[0]);
  } catch (e) { logError('payStatus', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.post('/api/invitations/set-slug', authMiddleware, async (req, res) => {
  try {
    const { invitationId, customSlug } = req.body;
    const cs = sanitize(customSlug, 30).replace(/[^a-zA-Z0-9-]/g, '');
    if (cs.length < 3) return res.status(400).json({ error: 'Slug kamida 3 belgi' });

    const inv = await sql`SELECT * FROM invitations WHERE id = ${invitationId} AND user_id = ${req.user.id}`;
    if (inv.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    if (!inv[0].is_paid && !inv[0].is_free) return res.status(400).json({ error: 'Avval to\'lov qiling' });

    const ex = await sql`SELECT id FROM invitations WHERE slug = ${cs} AND id != ${invitationId}`;
    if (ex.length > 0) return res.status(409).json({ error: 'Bu slug band' });

    const link = `${SITE_URL}/v/${cs}`;
    await sql`UPDATE invitations SET slug = ${cs}, link = ${link} WHERE id = ${invitationId}`;
    res.json({ link, slug: cs });
  } catch (e) { logError('setSlug', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== ADMIN ====================
app.get('/api/admin/templates', adminMiddleware, async (req, res) => {
  try { res.json({ templates: await sql`SELECT * FROM templates ORDER BY sort_order` }); }
  catch (e) { logError('adminTpl', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.post('/api/admin/templates', adminMiddleware, async (req, res) => {
  try {
    const b = req.body;
    if (!b.id || !b.category || !b.name_uz) return res.status(400).json({ error: 'id, category, name_uz kerak' });
    const r = await sql`
      INSERT INTO templates (id, category, name_uz, name_ru, tag_uz, tag_ru, is_free, price, bg_style, accent_color, text_color, decoration, sample_data, sort_order)
      VALUES (${b.id}, ${b.category}, ${b.name_uz}, ${b.name_ru||''}, ${b.tag_uz||''}, ${b.tag_ru||''},
        ${b.is_free !== false}, ${b.price||0}, ${b.bg_style||''}, ${b.accent_color||'#fff'}, ${b.text_color||'#000'},
        ${b.decoration||''}, ${JSON.stringify(b.sample_data||{})}, ${b.sort_order||0})
      RETURNING *`;
    res.json({ template: r[0] });
  } catch (e) { logError('adminTplCreate', e); res.status(500).json({ error: 'Server xatosi: ' + e.message }); }
});

app.put('/api/admin/templates/:id', adminMiddleware, async (req, res) => {
  try {
    const b = req.body;
    const r = await sql`
      UPDATE templates SET
        name_uz = COALESCE(${b.name_uz}, name_uz), name_ru = COALESCE(${b.name_ru}, name_ru),
        tag_uz = COALESCE(${b.tag_uz}, tag_uz), tag_ru = COALESCE(${b.tag_ru}, tag_ru),
        is_free = COALESCE(${b.is_free}, is_free), price = COALESCE(${b.price}, price),
        bg_style = COALESCE(${b.bg_style}, bg_style), accent_color = COALESCE(${b.accent_color}, accent_color),
        text_color = COALESCE(${b.text_color}, text_color), decoration = COALESCE(${b.decoration}, decoration),
        sample_data = COALESCE(${b.sample_data ? JSON.stringify(b.sample_data) : null}, sample_data),
        sort_order = COALESCE(${b.sort_order}, sort_order), is_active = COALESCE(${b.is_active}, is_active)
      WHERE id = ${req.params.id} RETURNING *`;
    if (r.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ template: r[0] });
  } catch (e) { logError('adminTplUpdate', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.delete('/api/admin/templates/:id', adminMiddleware, async (req, res) => {
  try { await sql`DELETE FROM templates WHERE id = ${req.params.id}`; res.json({ success: true }); }
  catch (e) { logError('adminTplDel', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const [u, i, r, p, rev] = await Promise.all([
      sql`SELECT COUNT(*) as c FROM users`,
      sql`SELECT COUNT(*) as c FROM invitations`,
      sql`SELECT COUNT(*) as c FROM responses`,
      sql`SELECT COUNT(*) as c FROM payments WHERE status='paid'`,
      sql`SELECT COALESCE(SUM(amount),0) as t FROM payments WHERE status='paid'`,
    ]);
    res.json({ users:+u[0].c, invitations:+i[0].c, responses:+r[0].c, paidPayments:+p[0].c, revenue:+rev[0].t });
  } catch (e) { logError('adminStats', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  try { res.json({ users: await sql`SELECT id, uid, login, telegram_id, created_at FROM users ORDER BY created_at DESC LIMIT 100` }); }
  catch (e) { logError('adminUsers', e); res.status(500).json({ error: 'Server xatosi' }); }
});

app.get('/api/admin/invitations', adminMiddleware, async (req, res) => {
  try {
    const r = await sql`
      SELECT i.*, u.login as user_login, t.name_uz as template_name,
        (SELECT COUNT(*) FROM responses r WHERE r.invitation_id = i.id) as response_count
      FROM invitations i LEFT JOIN users u ON i.user_id = u.id LEFT JOIN templates t ON i.template_id = t.id
      ORDER BY i.created_at DESC LIMIT 100`;
    res.json({ invitations: r });
  } catch (e) { logError('adminInv', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// Admin — to'lovlar ro'yxati (screenshot bilan)
app.get('/api/admin/payments', adminMiddleware, async (req, res) => {
  try {
    const r = await sql`
      SELECT p.id, p.code, p.amount, p.status, p.paid_at, p.screenshot_base64,
        i.uid as inv_uid, i.category, i.slug,
        u.login as user_login
      FROM payments p
      JOIN invitations i ON p.invitation_id = i.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC LIMIT 100`;
    res.json({ payments: r });
  } catch (e) { logError('adminPayments', e); res.status(500).json({ error: 'Server xatosi' }); }
});

// ==================== OG TAGS (link preview) ====================
app.get('/v/:slug', async (req, res) => {
  try {
    const r = await sql`
      SELECT i.category, i.data, i.slug, t.bg_style, t.accent_color FROM invitations i
      LEFT JOIN templates t ON i.template_id = t.id WHERE i.slug = ${req.params.slug}`;

    if (r.length > 0) {
      const inv = r[0];
      const d = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
      let title = 'Taklifnoma', desc = 'Sizni taklif qilamiz!', emoji = '📨';

      if (inv.category === 'wedding') {
        title = (d.groomName || '') + ' & ' + (d.brideName || '');
        desc = d.mainText ? d.mainText.slice(0, 150) : (title + ' to\'yiga taklif etamiz!');
        emoji = '💍';
      } else if (inv.category === 'birthday') {
        title = (d.birthdayPerson || '') + ' - Tug\'ilgan kun';
        desc = d.birthdayText ? d.birthdayText.slice(0, 150) : 'Tug\'ilgan kun bayramiga taklif!';
        emoji = '🎂';
      } else if (inv.category === 'event') {
        title = d.eventName || 'Tadbir';
        desc = d.eventDesc ? d.eventDesc.slice(0, 150) : 'Tadbirga taklif!';
        emoji = '🎤';
      } else if (inv.category === 'love') {
        title = (d.loveFrom || '') + ' ❤ ' + (d.loveTo || '');
        desc = 'Dil izhori';
        emoji = '❤️';
      }

      const safeTitle = title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
      const safeDesc = desc.replace(/"/g, '&quot;').replace(/</g, '&lt;');
      const color = inv.accent_color || '#7c3aed';
      const ogUrl = SITE_URL + '/v/' + req.params.slug;
      const ogImg = SITE_URL + '/og-image.svg';

      const ua = req.headers['user-agent'] || '';
      const isBot = /bot|crawler|spider|facebook|twitter|telegram|whatsapp|linkedin|vk|discord|slack/i.test(ua);

      if (isBot) {
        // Botlar uchun OG meta inject qilingan index.html
        const fs = await import('fs');
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        let html = '';
        try { html = fs.readFileSync(indexPath, 'utf8'); } catch {}

        if (html) {
          const ogTags = `
  <title>${emoji} ${safeTitle} | Taklifnomachi</title>
  <meta name="description" content="${safeDesc}">
  <meta property="og:title" content="${emoji} ${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:site_name" content="Taklifnomachi.online">
  <meta property="og:locale" content="uz_UZ">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${emoji} ${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${ogImg}">
  <meta name="theme-color" content="${color}">`;
          html = html.replace(/<title>[^<]*<\/title>/, '');
          html = html.replace('</head>', ogTags + '\n</head>');
          return res.send(html);
        }
      }
    }
  } catch (e) { logError('ogTags', e); }

  // Browser — SPA ga
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ==================== SPA FALLBACK ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log(`🚀 Taklifnomachi server: http://localhost:${PORT}`);
  console.log(`   ENV: ${NODE_ENV} | URL: ${SITE_URL}`);

  // Neon keep-alive: har 4 daqiqada yengil ping
  // Sabab: Render 15 daqiqada uxlab qoladi → Neon compute o'chadi
  // → Qayta uyg'onganda CPU spike → 191 soat tez tugaydi
  // Bu ping Render ni emas, Neon ni jonli ushlab turadi
  if (IS_PROD) {
    setInterval(async () => {
      try {
        await sql`SELECT 1`;
        console.log('[keep-alive] Neon ping OK');
      } catch (e) {
        console.error('[keep-alive] Neon ping xato:', e.message);
      }
    }, 4 * 60 * 1000); // 4 daqiqa
  }
});
