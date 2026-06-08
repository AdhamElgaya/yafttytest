const STORAGE_KEY = 'yaftty_admin_secret';

export function getAdminSecret() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(STORAGE_KEY) || '';
}

export function setAdminSecret(secret) {
  if (typeof window === 'undefined') return;
  if (secret) sessionStorage.setItem(STORAGE_KEY, secret);
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function adminFetch(url, options = {}) {
  const secret = getAdminSecret();
  const headers = {
    ...(options.headers || {}),
    ...(secret ? { 'x-yaftty-admin-secret': secret } : {}),
  };
  return fetch(url, { ...options, headers });
}
