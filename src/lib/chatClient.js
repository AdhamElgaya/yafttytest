import { supabase } from './supabase';
import { ACTIVE_PROFILE_KEY } from './profileUtils';

export async function getChatAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
}

export function getActiveProfileId() {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem(ACTIVE_PROFILE_KEY) ||
    sessionStorage.getItem(ACTIVE_PROFILE_KEY) ||
    null
  );
}

export async function chatFetch(path, options = {}) {
  const token = await getChatAccessToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(path, { ...options, headers });
}
