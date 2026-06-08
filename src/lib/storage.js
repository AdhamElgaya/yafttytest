import { supabase } from './supabase';

/** 'r2' | 'supabase' — set NEXT_PUBLIC_STORAGE_PROVIDER=r2 in .env */
export function getStorageProvider() {
  const provider = (process.env.NEXT_PUBLIC_STORAGE_PROVIDER || '').toLowerCase();
  if (provider === 'r2') return 'r2';
  return 'supabase';
}

async function getAccessToken() {
  const readToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  let token = await readToken();
  if (token) return token;

  const { data: refreshed, error } = await supabase.auth.refreshSession();
  if (!error && refreshed.session?.access_token) {
    return refreshed.session.access_token;
  }

  // Wait for client auth hydration (common on first interaction after page load)
  token = await new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      subscription.unsubscribe();
      resolve(value);
    };

    const timer = setTimeout(() => {
      readToken().then(finish);
    }, 2500);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) finish(session.access_token);
    });
  });

  return token;
}

async function uploadViaR2(file, kind) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('You must be logged in to upload files.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('kind', kind);

  const res = await fetch('/api/storage/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.url || data.path;
}

async function uploadViaSupabase(file, bucket) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('You must be logged in to upload files.');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);
  if (userError || !user?.id) {
    throw new Error('You must be logged in to upload files.');
  }

  const uid = user.id;
  const ext = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const path = `${uid}/${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  if (bucket === 'banner-images') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  return path;
}

/**
 * Upload banner image or document.
 * @param {File} file
 * @param {'banner-images'|'documents'} bucket
 * @returns {Promise<string>} public URL (images) or storage path (documents)
 */
export async function uploadFile(file, bucket = 'banner-images') {
  if (getStorageProvider() === 'r2') {
    const kind = bucket === 'documents' ? 'document' : 'banner-image';
    return uploadViaR2(file, kind);
  }
  return uploadViaSupabase(file, bucket);
}

/**
 * Signed URL for private documents (R2 or Supabase).
 */
export async function getDocumentSignedUrl(path, expiresIn = 3600) {
  if (getStorageProvider() === 'r2') {
    const token = await getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(
      `/api/storage/signed-url?path=${encodeURIComponent(path)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get document URL');
    return data.signedUrl;
  }

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
