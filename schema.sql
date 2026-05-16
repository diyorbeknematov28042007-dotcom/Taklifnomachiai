-- =============================================
-- TAKLIFNOMACHI.ONLINE — Neon PostgreSQL Schema
-- =============================================

-- Foydalanuvchilar
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(10) UNIQUE NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telegram_id BIGINT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shablonlar (admin panel orqali boshqariladi)
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(10) PRIMARY KEY,
  category VARCHAR(20) NOT NULL CHECK (category IN ('wedding','birthday','event','love')),
  name_uz VARCHAR(100) NOT NULL,
  name_ru VARCHAR(100) NOT NULL,
  tag_uz VARCHAR(50),
  tag_ru VARCHAR(50),
  is_free BOOLEAN DEFAULT true,
  price INTEGER DEFAULT 0,
  bg_style TEXT,
  accent_color VARCHAR(20),
  text_color VARCHAR(20),
  decoration VARCHAR(30),
  sample_data JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Taklifnomalar
CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(10) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id VARCHAR(10) REFERENCES templates(id),
  category VARCHAR(20) NOT NULL,
  data JSONB NOT NULL,
  slug VARCHAR(100) UNIQUE,
  link VARCHAR(255),
  is_free BOOLEAN DEFAULT true,
  price INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  payment_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Javoblar (RSVP)
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
  rsvp VARCHAR(20) CHECK (rsvp IN ('attending','notAttending','maybe')),
  guest_count INTEGER DEFAULT 1,
  message TEXT,
  sender_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- To'lovlar
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  invitation_id INTEGER REFERENCES invitations(id),
  code VARCHAR(10) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  telegram_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

-- Indekslar
CREATE INDEX idx_invitations_user ON invitations(user_id);
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_uid ON invitations(uid);
CREATE INDEX idx_responses_invitation ON responses(invitation_id);
CREATE INDEX idx_payments_code ON payments(code);
CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_users_telegram ON users(telegram_id);

-- Boshlang'ich shablonlar
INSERT INTO templates (id, category, name_uz, name_ru, tag_uz, tag_ru, is_free, price, bg_style, accent_color, text_color, decoration, sample_data, sort_order) VALUES
('w1', 'wedding', 'Oq oltin uslub', 'Белое золото', 'To''y', 'Свадьба', true, 0, 'linear-gradient(135deg, #f5f0e8 0%, #fff9f0 50%, #f0e6d3 100%)', '#8B6914', '#5a4a2a', 'rings', '{"name1":"Aziz","name2":"Madina","date":"25.08.2024"}', 1),
('w2', 'wedding', 'Gullar uslubi', 'Цветочный стиль', 'To''y', 'Свадьба', true, 0, 'linear-gradient(135deg, #fce4ec 0%, #fff 50%, #e8f5e9 100%)', '#e91e63', '#4a2040', 'flowers', '{"name1":"Jamshid","name2":"Laylo","date":"10.09.2024"}', 2),
('w3', 'wedding', 'Qorong''u elegans', 'Тёмная элегантность', 'To''y', 'Свадьба', false, 25000, 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', '#c9a96e', '#e0d5c0', 'stars', '{"name1":"Bobur","name2":"Sevinch","date":"01.12.2024"}', 3),
('b1', 'birthday', 'Zamonaviy tug''ilgan kun', 'Современный день рождения', 'Tug''ilgan kun', 'День рождения', false, 15000, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#fff', '#fff', 'balloons', '{"person":"Sardor","age":"18 YOSH"}', 4),
('b2', 'birthday', 'Bolalar bayrami', 'Детский праздник', 'Tug''ilgan kun', 'День рождения', true, 0, 'linear-gradient(135deg, #fff9c4 0%, #ffecb3 50%, #ffe0b2 100%)', '#ff6f00', '#5d4037', 'confetti', '{"person":"Asal","age":"7 YOSH"}', 5),
('e1', 'event', 'Tadbir va konferensiya', 'Конференция', 'Tadbir', 'Мероприятие', true, 0, 'linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #0d1b3e 100%)', '#4fc3f7', '#e0e0e0', 'lights', '{"name":"KONFERENSIYA 2024","sub":"Kelajak sari qadam","date":"25 May | 10:00","loc":"Toshkent"}', 6),
('e2', 'event', 'Ochiq tadbir', 'Открытое мероприятие', 'Tadbir', 'Мероприятие', false, 15000, 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #9fa8da 100%)', '#283593', '#1a237e', 'mic', '{"name":"MEETUP 2024","sub":"IT jamiyati","date":"15 Jun | 14:00","loc":"Toshkent"}', 7),
('l1', 'love', 'Sevgi izhori', 'Признание в любви', 'Dil izhori', 'Признание', false, 10000, 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)', '#c2185b', '#880e4f', 'hearts', '{"text":"Seni Sevaman"}', 8),
('l2', 'love', 'Yulduzli tun', 'Звёздная ночь', 'Dil izhori', 'Признание', true, 0, 'linear-gradient(135deg, #0d0221 0%, #150534 50%, #1a0a3e 100%)', '#ffd54f', '#e0d0ff', 'moon', '{"text":"Yuragimdasiz"}', 9)
ON CONFLICT (id) DO NOTHING;
