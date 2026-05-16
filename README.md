# 🎉 Taklifnomachi.online

To'y, tug'ilgan kun, tadbir va dil izhorlari uchun maxsus raqamli taklifnomalar yaratish platformasi.

## 🛠 Texnologiyalar

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Express.js + Node.js
- **Database:** Neon PostgreSQL (Serverless)
- **Deploy:** Render.com
- **Auth:** JWT + bcrypt

---

## 🚀 Deploy qilish (Bosqichma-bosqich)

### 1-BOSQICH: Neon Database

1. [neon.tech](https://neon.tech) ga kiring va ro'yxatdan o'ting
2. **New Project** → nom: `taklifnomachi`
3. Region: `AWS US East (Ohio)` yoki yaqinroq
4. Project yaratilgandan keyin **Connection string** ni nusxalang:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. **SQL Editor** ga kiring
6. `schema.sql` faylining ichidagi barcha SQL ni nusxalab, SQL Editorga joylang va **Run** bosing

### 2-BOSQICH: GitHub Repository

1. [github.com](https://github.com) da yangi repository yarating: `taklifnomachi`
2. Kompyuteringizda:
   ```bash
   cd taklifnomachi
   git init
   git add .
   git commit -m "Initial commit - Taklifnomachi.online"
   git branch -M main
   git remote add origin https://github.com/SIZNING_USERNAME/taklifnomachi.git
   git push -u origin main
   ```

### 3-BOSQICH: Render.com Deploy

1. [render.com](https://render.com) ga kiring
2. **New** → **Web Service**
3. GitHub reponi ulang → `taklifnomachi` ni tanlang
4. Sozlamalar:
   - **Name:** `taklifnomachi`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server.js`
5. **Environment Variables** qo'shing:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Neon dan olgan connection string |
   | `JWT_SECRET` | Istalgan uzun maxfiy kalit (masalan: `tkn-secret-2026-xYz123!@#`) |
   | `SITE_URL` | `https://taklifnomachi.online` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |
6. **Create Web Service** bosing

### 4-BOSQICH: Domen ulash

1. Render dashboard → sizning service → **Settings** → **Custom Domains**
2. `taklifnomachi.online` kiriting
3. Render sizga DNS yozuvlarini ko'rsatadi:
   - **CNAME** yoki **A record** — bu yozuvlarni domen provayderingizda qo'shing
4. Domen provayderingiz (masalan: ahost.uz, webhost.uz, namecheap, cloudflare):
   - DNS sozlamalariga kiring
   - Render ko'rsatgan yozuvlarni qo'shing
5. 5-30 daqiqa kuting — SSL avtomatik ulanadi

---

## 💻 Lokal ishga tushirish (development)

```bash
# 1. .env faylni yarating
cp .env.example .env
# .env ichiga DATABASE_URL va JWT_SECRET yozing

# 2. Dependencies o'rnatish
npm install

# 3. Database schema
# Neon SQL Editor da schema.sql ni ishga tushiring

# 4. Backend ishga tushirish
node server.js

# 5. Boshqa terminalda frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

---

## 📁 Loyiha tuzilishi

```
taklifnomachi/
├── server.js           # Express backend (API + static serve)
├── schema.sql          # Neon PostgreSQL schema
├── vite.config.js      # Vite konfiguratsiya
├── render.yaml         # Render deploy config
├── package.json
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # Entry point
    ├── App.jsx         # Barcha sahifalar va routing
    ├── lib/
    │   ├── api.js      # Frontend API helper
    │   ├── db.js       # Neon connection
    │   └── i18n.js     # O'zbek/Rus tarjimalar
    └── styles/
        └── global.css  # Barcha stillar
```

## 📋 API Endpoints

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Kirish |
| GET | `/api/auth/me` | Profil (token kerak) |
| GET | `/api/templates` | Shablonlar ro'yxati |
| GET | `/api/templates/:id` | Bitta shablon |
| POST | `/api/invitations` | Taklifnoma yaratish |
| GET | `/api/invitations/my` | Mening taklifnomalarim |
| GET | `/api/invitations/view/:slug` | Public ko'rish |
| POST | `/api/responses` | Javob yuborish |
| GET | `/api/responses/:invitationId` | Javoblar ro'yxati |
| POST | `/api/payments/verify` | To'lov tasdiqlash |
| POST | `/api/invitations/set-slug` | Maxsus slug berish |
