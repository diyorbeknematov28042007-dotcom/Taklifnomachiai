const BASE = '/api';

// ==================== XAVFSIZ STORAGE ====================
// Instagram/Safari WebView ba'zan localStorage ni bloklaydi (private mode,
// cross-site tracking himoyasi). Bunday holda xotirada (memory) saqlaymiz —
// sayt crash bo'lmaydi, faqat sessiya tab yopilganda yo'qoladi.
const memoryStore = {};
let lsAvailable = null;

function checkLS() {
  if (lsAvailable !== null) return lsAvailable;
  try {
    const test = '__ls_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    lsAvailable = true;
  } catch {
    lsAvailable = false;
  }
  return lsAvailable;
}

export const storage = {
  get(key) {
    try {
      if (checkLS()) return window.localStorage.getItem(key);
    } catch {}
    return key in memoryStore ? memoryStore[key] : null;
  },
  set(key, value) {
    try {
      if (checkLS()) { window.localStorage.setItem(key, value); return; }
    } catch {}
    memoryStore[key] = value;
  },
  remove(key) {
    try {
      if (checkLS()) { window.localStorage.removeItem(key); return; }
    } catch {}
    delete memoryStore[key];
  }
};

function getToken() { return storage.get('tkn_token'); }
function setToken(token) { storage.set('tkn_token', token); }
function removeToken() { storage.remove('tkn_token'); }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Timeout — sekin server UI ni muzlatmasin (15 sek)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let res, data;
  try {
    res = await fetch(BASE + path, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      const err = new Error('So\'rov juda uzoq davom etdi. Internetni tekshiring.');
      err.code = 'TIMEOUT';
      throw err;
    }
    const err = new Error('Internet aloqasi yo\'q yoki server javob bermayapti.');
    err.code = 'NETWORK';
    throw err;
  }

  try {
    data = await res.json();
  } catch {
    const err = new Error('Server noto\'g\'ri javob qaytardi.');
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data.error || 'Xatolik');
    err.code = data.code;
    err.suggestions = data.suggestions;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Auth
export async function register(login, password) {
  const data = await request('/auth/register', { method:'POST', body:JSON.stringify({login,password}) });
  setToken(data.token); return data;
}
export async function login(loginName, password) {
  const data = await request('/auth/login', { method:'POST', body:JSON.stringify({login:loginName,password}) });
  setToken(data.token); return data;
}
export async function getMe() { return request('/auth/me'); }
export function logout() { removeToken(); }
export function isLoggedIn() { return !!getToken(); }

// Templates
export async function getTemplates(category) {
  const q = category ? `?category=${category}` : '';
  return request('/templates' + q);
}
export async function getTemplate(id) { return request('/templates/' + id); }

// Invitations
export async function createInvitation(templateId, category, data, customSlug) {
  return request('/invitations', { method:'POST', body:JSON.stringify({templateId,category,data,customSlug}) });
}
export async function getMyInvitations() { return request('/invitations/my'); }

// TUZATILDI: by-slug endpoint ishlatiladi
export async function viewBySlug(slug) {
  return request('/invitations/by-slug/' + slug);
}

export async function getInvByUid(uid) {
  return request('/invitations/' + uid);
}

export async function setSlug(invitationId, customSlug) {
  return request('/invitations/set-slug', { method:'POST', body:JSON.stringify({invitationId,customSlug}) });
}

// Responses
export async function sendResponse(invitationId, rsvp, guestCount, message, senderName) {
  return request('/responses', { method:'POST', body:JSON.stringify({invitationId,rsvp,guestCount,message,senderName}) });
}
export async function getResponses(invitationId) { return request('/responses/' + invitationId); }

// Payments
export async function getPaymentCard() {
  return request('/payments/card');
}

export async function getPaymentStatus(uid) {
  return request('/payments/status/' + uid);
}
