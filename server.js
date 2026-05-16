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
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

// ==================== HELPERS ====================
function generateUID() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateSlugID() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function transliterate(s) {
  const m = {"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ъ":"","ы":"i","ь":"","э":"e","ю":"yu","я":"ya","ў":"o","қ":"q","ғ":"g","ҳ":"h","'":"","ʻ":""};
  return s.toLowerCase().split("").map(c => m[c] || c).join("")
    .replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token kerak' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token yaroqsiz' });
  }
}

// ==================== AUTH ROUTES ====================

// Ro'yxatdan o'tish
app.post('/api/auth/register', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Login va parol kerak' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Parol kamida 6 belgi', code: 'PASSWORD_SHORT' });
    }

    // Login band emasligini tekshirish
    const existing = await sql`SELECT id FROM users WHERE login = ${login}`;
    if (existing.length > 0) {
      // Tavsiyalar generatsiya qilish
      const suggestions = [
        login + Math.floor(Math.random() * 999),
        login + '_' + Math.floor(Math.random() * 99),
        login + '.' + new Date().getFullYear()
      ];
      return res.status(409).json({ error: 'Login band', code: 'LOGIN_TAKEN', suggestions });
    }

    const uid = generateUID();
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (uid, login, password_hash)
      VALUES (${uid}, ${login}, ${passwordHash})
      RETURNING id, uid, login, created_at
    `;

    const user = result[0];
    const token = jwt.sign({ id: user.id, uid: user.uid, login: user.login }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ user: { id: user.id, uid: user.uid, login: user.login }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Kirish
app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const users = await sql`SELECT * FROM users WHERE login = ${login}`;
    if (users.length === 0) {
      return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }

    const token = jwt.sign({ id: user.id, uid: user.uid, login: user.login }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ user: { id: user.id, uid: user.uid, login: user.login }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Profil
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const users = await sql`SELECT id, uid, login, created_at FROM users WHERE id = ${req.user.id}`;
    if (users.length === 0) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// ==================== TEMPLATES ROUTES ====================

// Barcha shablonlar
app.get('/api/templates', async (req, res) => {
  try {
    const { category } = req.query;
    let result;
    if (category) {
      result = await sql`SELECT * FROM templates WHERE is_active = true AND category = ${category} ORDER BY sort_order`;
    } else {
      result = await sql`SELECT * FROM templates WHERE is_active = true ORDER BY sort_order`;
    }
    res.json({ templates: result });
  } catch (err) {
    console.error('Templates error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Bitta shablon
app.get('/api/templates/:id', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM templates WHERE id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: 'Shablon topilmadi' });
    res.json({ template: result[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// ==================== INVITATIONS ROUTES ====================

// Taklifnoma yaratish
app.post('/api/invitations', authMiddleware, async (req, res) => {
  try {
    const { templateId, category, data, customSlug } = req.body;
    const uid = generateSlugID();

    // Shablon tekshirish
    const tpls = await sql`SELECT * FROM templates WHERE id = ${templateId}`;
    if (tpls.length === 0) return res.status(404).json({ error: 'Shablon topilmadi' });
    const tpl = tpls[0];

    let slug, link;
    const isFree = tpl.is_free;

    if (isFree) {
      // Bepul shablon — avtomatik link
      let names = '';
      if (category === 'wedding') names = transliterate((data.groomName || '') + '-' + (data.brideName || ''));
      else if (category === 'birthday') names = transliterate(data.birthdayPerson || '');
      else if (category === 'love') names = transliterate((data.loveFrom || '') + '-' + (data.loveTo || ''));
      else names = transliterate(data.eventName || '');

      slug = `${category}/${names}/${uid}`;
      link = `${process.env.SITE_URL || 'https://taklifnomachi.online'}/${slug}`;
    } else {
      // Pullik shablon
      if (customSlug) {
        // Slug bandligini tekshirish
        const existingSlug = await sql`SELECT id FROM invitations WHERE slug = ${customSlug}`;
        if (existingSlug.length > 0) {
          return res.status(409).json({ error: 'Bu slug band' });
        }
        slug = customSlug;
      }
    }

    // To'lov kodi generatsiya (pullik uchun)
    const paymentCode = !isFree ? generateUID() : null;

    const result = await sql`
      INSERT INTO invitations (uid, user_id, template_id, category, data, slug, link, is_free, price, payment_code)
      VALUES (${uid}, ${req.user.id}, ${templateId}, ${category}, ${JSON.stringify(data)}, ${slug}, ${link}, ${isFree}, ${tpl.price}, ${paymentCode})
      RETURNING *
    `;

    const inv = result[0];

    // Pullik bo'lsa to'lov yozuvi yaratish
    if (!isFree && paymentCode) {
      await sql`
        INSERT INTO payments (user_id, invitation_id, code, amount)
        VALUES (${req.user.id}, ${inv.id}, ${paymentCode}, ${tpl.price})
      `;
    }

    res.json({ invitation: inv, paymentCode });
  } catch (err) {
    console.error('Create invitation error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Foydalanuvchi taklifnomalari
app.get('/api/invitations/my', authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT i.*, t.name_uz as template_name_uz, t.name_ru as template_name_ru,
        (SELECT COUNT(*) FROM responses r WHERE r.invitation_id = i.id) as response_count
      FROM invitations i
      LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.user_id = ${req.user.id}
      ORDER BY i.created_at DESC
    `;
    res.json({ invitations: result });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Taklifnomani slug bo'yicha ko'rish (public)
app.get('/api/invitations/view/:slug(*)', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await sql`
      SELECT i.*, t.bg_style, t.accent_color, t.text_color, t.decoration,
        t.name_uz as template_name_uz, t.name_ru as template_name_ru
      FROM invitations i
      LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.slug = ${slug}
    `;
    if (result.length === 0) return res.status(404).json({ error: 'Taklifnoma topilmadi' });
    res.json({ invitation: result[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Taklifnomani uid bo'yicha ko'rish
app.get('/api/invitations/:uid', async (req, res) => {
  try {
    const result = await sql`
      SELECT i.*, t.bg_style, t.accent_color, t.text_color, t.decoration
      FROM invitations i
      LEFT JOIN templates t ON i.template_id = t.id
      WHERE i.uid = ${req.params.uid}
    `;
    if (result.length === 0) return res.status(404).json({ error: 'Topilmadi' });
    res.json({ invitation: result[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// ==================== RESPONSES ROUTES ====================

// Javob yuborish (public)
app.post('/api/responses', async (req, res) => {
  try {
    const { invitationId, rsvp, guestCount, message, senderName } = req.body;

    const result = await sql`
      INSERT INTO responses (invitation_id, rsvp, guest_count, message, sender_name)
      VALUES (${invitationId}, ${rsvp || null}, ${guestCount || 1}, ${message || ''}, ${senderName || ''})
      RETURNING *
    `;

    res.json({ response: result[0] });
  } catch (err) {
    console.error('Response error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Taklifnoma javoblari
app.get('/api/responses/:invitationId', authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM responses
      WHERE invitation_id = ${req.params.invitationId}
      ORDER BY created_at DESC
    `;
    res.json({ responses: result });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// ==================== PAYMENTS ROUTES ====================

// To'lov tekshirish (bot uchun)
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { code, telegramId } = req.body;

    const payments = await sql`SELECT * FROM payments WHERE code = ${code} AND status = 'pending'`;
    if (payments.length === 0) return res.status(404).json({ error: 'To\'lov topilmadi' });

    const payment = payments[0];

    // To'lovni tasdiqlash
    await sql`
      UPDATE payments SET status = 'paid', telegram_id = ${telegramId}, paid_at = NOW()
      WHERE id = ${payment.id}
    `;

    // Taklifnomani yangilash
    await sql`UPDATE invitations SET is_paid = true WHERE id = ${payment.invitation_id}`;

    // Foydalanuvchi telegram_id ni saqlash
    if (telegramId) {
      await sql`UPDATE users SET telegram_id = ${telegramId} WHERE id = ${payment.user_id}`;
    }

    res.json({ success: true, payment: { ...payment, status: 'paid' } });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Slug orqali link yaratish (to'lovdan keyin)
app.post('/api/invitations/set-slug', authMiddleware, async (req, res) => {
  try {
    const { invitationId, customSlug } = req.body;

    // Tekshirish
    const inv = await sql`SELECT * FROM invitations WHERE id = ${invitationId} AND user_id = ${req.user.id}`;
    if (inv.length === 0) return res.status(404).json({ error: 'Topilmadi' });

    if (!inv[0].is_paid && !inv[0].is_free) {
      return res.status(400).json({ error: 'Avval to\'lov qiling' });
    }

    // Slug bandligini tekshirish
    const existing = await sql`SELECT id FROM invitations WHERE slug = ${customSlug} AND id != ${invitationId}`;
    if (existing.length > 0) return res.status(409).json({ error: 'Bu slug band' });

    const link = `${process.env.SITE_URL || 'https://taklifnomachi.online'}/${customSlug}`;
    await sql`UPDATE invitations SET slug = ${customSlug}, link = ${link} WHERE id = ${invitationId}`;

    res.json({ link, slug: customSlug });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// ==================== SPA FALLBACK ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Taklifnomachi server: http://localhost:${PORT}`);
});
