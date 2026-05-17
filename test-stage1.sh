#!/bin/bash
# ============================================
# BOSQICH 1 — TEKSHIRISH SKRIPTI
# ============================================
# Ishlatish: bash test-stage1.sh https://taklifnomachiai.onrender.com
# ============================================

BASE="${1:-https://taklifnomachiai.onrender.com}"
PASS=0
FAIL=0
WARN=0

green() { echo -e "\033[32m✅ PASS: $1\033[0m"; PASS=$((PASS+1)); }
red()   { echo -e "\033[31m❌ FAIL: $1\033[0m"; FAIL=$((FAIL+1)); }
yellow(){ echo -e "\033[33m⚠️  WARN: $1\033[0m"; WARN=$((WARN+1)); }

echo "============================================"
echo "🧪 BOSQICH 1 — Loyiha asosi tekshiruvi"
echo "   Sayt: $BASE"
echo "============================================"
echo ""

# 1. Health check
echo "--- 1. Health Check ---"
HEALTH=$(curl -s "$BASE/api/health")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  green "Health endpoint ishlayapti"
else
  red "Health endpoint ishlamayapti: $HEALTH"
fi

if echo "$HEALTH" | grep -q '"db":"connected"'; then
  green "Database ulangan"
else
  red "Database ulanmagan"
fi

if echo "$HEALTH" | grep -q '"dbLatency"'; then
  LATENCY=$(echo "$HEALTH" | grep -o '"dbLatency":"[^"]*"')
  green "DB latency mavjud: $LATENCY"
else
  yellow "DB latency yo'q (eski server versiyasi?)"
fi

if echo "$HEALTH" | grep -q '"uptime"'; then
  green "Uptime ko'rsatkichi mavjud"
else
  yellow "Uptime yo'q"
fi
echo ""

# 2. HTTPS & Security Headers
echo "--- 2. Xavfsizlik ---"
HEADERS=$(curl -sI "$BASE/api/health")

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
  green "X-Content-Type-Options header bor"
else
  yellow "X-Content-Type-Options header yo'q"
fi

if echo "$HEADERS" | grep -qi "x-frame-options"; then
  green "X-Frame-Options header bor"
else
  yellow "X-Frame-Options header yo'q"
fi

# 3. Bosh sahifa
echo ""
echo "--- 3. Bosh sahifa ---"
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE")
if [ "$HOME_STATUS" = "200" ]; then
  green "Bosh sahifa 200 OK"
else
  red "Bosh sahifa xato: HTTP $HOME_STATUS"
fi

HOME_BODY=$(curl -s "$BASE")
if echo "$HOME_BODY" | grep -q "Taklifnomachi"; then
  green "Sahifa kontenti to'g'ri (Taklifnomachi topildi)"
else
  red "Sahifa kontenti noto'g'ri"
fi
echo ""

# 4. Auth — Register (noto'g'ri ma'lumotlar)
echo "--- 4. Auth validatsiya ---"
# Bo'sh login
R1=$(curl -s -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" -d '{"login":"","password":"123456"}')
if echo "$R1" | grep -q '"error"'; then
  green "Bo'sh login rad etildi"
else
  red "Bo'sh login qabul qilindi — validatsiya yo'q!"
fi

# Qisqa parol
R2=$(curl -s -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" -d '{"login":"testuser99","password":"12"}')
if echo "$R2" | grep -q '"error"'; then
  green "Qisqa parol rad etildi"
else
  red "Qisqa parol qabul qilindi!"
fi

# Noto'g'ri login
R3=$(curl -s -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"login":"nonexistent_user_xyz","password":"wrongpass"}')
if echo "$R3" | grep -q '"error"'; then
  green "Noto'g'ri login rad etildi"
else
  red "Noto'g'ri login qabul qilindi!"
fi
echo ""

# 5. Templates API
echo "--- 5. Templates ---"
TPLS=$(curl -s "$BASE/api/templates")
if echo "$TPLS" | grep -q '"templates"'; then
  green "Templates endpoint ishlayapti"
  TPL_COUNT=$(echo "$TPLS" | grep -o '"id"' | wc -l)
  if [ "$TPL_COUNT" -gt 0 ]; then
    green "Database'da $TPL_COUNT ta shablon bor"
  else
    yellow "Database'da shablonlar yo'q — seed data kiritilmagan"
  fi
else
  red "Templates endpoint ishlamayapti"
fi
echo ""

# 6. Rate limiting
echo "--- 6. Rate Limiting ---"
RL_PASS=true
for i in $(seq 1 12); do
  RR=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"login":"ratetest","password":"ratetest"}')
  if [ "$RR" = "429" ]; then
    green "Rate limiting ishlayapti (${i}-chi so'rovda bloklandi)"
    RL_PASS=false
    break
  fi
done
if [ "$RL_PASS" = true ]; then
  yellow "Rate limiting ishlamayapti yoki limit yuqori (12 so'rov o'tdi)"
fi
echo ""

# 7. Noto'g'ri endpointlar
echo "--- 7. Error handling ---"
E1=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/templates/nonexistent_id")
if [ "$E1" = "404" ]; then
  green "Topilmagan shablon 404 qaytaradi"
else
  yellow "Topilmagan shablon $E1 qaytaradi (404 kutilgan)"
fi

E2=$(curl -s -X GET "$BASE/api/invitations/by-slug/nonexistent_slug_xyz")
if echo "$E2" | grep -q '"error"'; then
  green "Topilmagan slug error qaytaradi"
else
  red "Topilmagan slug error qaytarmayapti"
fi

E3=$(curl -s -X GET "$BASE/api/auth/me")
if echo "$E3" | grep -q '"error"'; then
  green "Tokensiz /me request rad etildi"
else
  red "Tokensiz /me request qabul qilindi!"
fi
echo ""

# 8. Admin himoya
echo "--- 8. Admin himoyasi ---"
A1=$(curl -s "$BASE/api/admin/stats")
if echo "$A1" | grep -q '"error"'; then
  green "Admin endpoint kalitsiz rad etildi"
else
  red "Admin endpoint kalitsiz ochiq!"
fi

A2=$(curl -s "$BASE/api/admin/stats" -H "x-admin-key: wrong-key-123")
if echo "$A2" | grep -q '"error"'; then
  green "Noto'g'ri admin kalit rad etildi"
else
  red "Noto'g'ri admin kalit qabul qilindi!"
fi
echo ""

# 9. JSON body limit
echo "--- 9. Body limit ---"
BIG_DATA=$(python3 -c "print('{\"x\":\"' + 'A'*2000000 + '\"}')" 2>/dev/null || echo '{"x":"skip"}')
if [ "$BIG_DATA" != '{"x":"skip"}' ]; then
  B1=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" -d "$BIG_DATA")
  if [ "$B1" = "413" ] || [ "$B1" = "400" ]; then
    green "Katta body rad etildi (HTTP $B1)"
  else
    yellow "Katta body rad etilmadi (HTTP $B1)"
  fi
else
  yellow "Body limit testi o'tkazilmadi (python3 yo'q)"
fi
echo ""

# 10. SPA Fallback
echo "--- 10. SPA Fallback ---"
SPA=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/v/test-slug")
if [ "$SPA" = "200" ]; then
  green "SPA fallback /v/:slug uchun ishlayapti"
else
  red "SPA fallback ishlamayapti (HTTP $SPA)"
fi

SPA2=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/profile")
if [ "$SPA2" = "200" ]; then
  green "SPA fallback /profile uchun ishlayapti"
else
  red "SPA fallback /profile ishlamayapti"
fi
echo ""

# ============ NATIJA ============
echo "============================================"
echo "📊 NATIJA"
echo "   ✅ O'tdi:  $PASS"
echo "   ❌ Xato:   $FAIL"  
echo "   ⚠️  Ogohlantirish: $WARN"
echo "============================================"

if [ "$FAIL" -eq 0 ]; then
  echo "🎉 BOSQICH 1 — TAYYOR! Keyingi bosqichga o'tish mumkin."
else
  echo "🔧 $FAIL ta xato tuzatilishi kerak!"
fi
