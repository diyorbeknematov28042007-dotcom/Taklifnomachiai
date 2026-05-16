const BASE = '/api';

function getToken() { return localStorage.getItem('tkn_token'); }
function setToken(token) { localStorage.setItem('tkn_token', token); }
function removeToken() { localStorage.removeItem('tkn_token'); }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json();
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
export async function verifyPayment(code, telegramId) {
  return request('/payments/verify', { method:'POST', body:JSON.stringify({code,telegramId}) });
}
