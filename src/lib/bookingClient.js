import { supabase } from './supabase';

export async function getBookingAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function bookingAuthHeaders(json = false) {
  const token = await getBookingAccessToken();
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
