import { getSupabaseAdmin } from './supabaseAdmin';
import { createR2SignedUrlForDocument, isR2Configured, normalizeDocumentKey } from './r2Server';
import { rowToBanner } from './banners';
import { splitFullName } from './profileUtils';

function ownerFromProfile(ownerProfile) {
  if (!ownerProfile) return null;
  const { firstName, lastName } = splitFullName(ownerProfile.full_name);
  const bank = ownerProfile.bank_account || {};
  const company =
    bank.company ||
    bank.companyName ||
    ownerProfile.company ||
    null;

  return {
    email: ownerProfile.email,
    fullName: ownerProfile.full_name,
    firstName: firstName?.trim() || null,
    lastName: lastName?.trim() || null,
    company: typeof company === 'string' ? company.trim() || null : null,
  };
}

async function resolveDocumentUrls(documentUrls) {
  if (!documentUrls?.length) return [];
  const out = [];
  for (const raw of documentUrls) {
    if (isR2Configured() && raw && !raw.startsWith('http')) {
      try {
        const signed = await createR2SignedUrlForDocument(normalizeDocumentKey(raw), 3600);
        out.push(signed);
        continue;
      } catch (err) {
        console.error('Admin document signed URL failed:', err);
      }
    }
    out.push(raw);
  }
  return out;
}

function toAdminRequest(row, ownerProfile) {
  const banner = rowToBanner(row);
  return {
    _id: banner.id,
    id: banner.id,
    location: banner.location,
    size: banner.size,
    type: banner.type,
    traffic: banner.traffic,
    pricePerMonth: banner.pricePerMonth,
    status: banner.status,
    banner_status: banner.banner_status,
    coordinates: banner.coordinates,
    bannerImageUrl: banner.bannerImageUrl,
    documentUrls: banner.documentUrls,
    createdAt: banner.createdAt,
    owner: ownerFromProfile(ownerProfile),
  };
}

export async function fetchAdminBannerRequests({ status } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      'Admin database access is not configured. Add SUPABASE_SERVICE_ROLE_KEY to website/.env and restart the dev server.'
    );
  }

  let query = supabase
    .from('banners')
    .select('*, owner:profiles!owner_id(email, full_name, auth_id, bank_account)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  } else {
    query = query.in('status', ['pending', 'approved', 'rejected']);
  }

  const { data, error } = await query;
  if (error) {
    const msg = error.message || '';
    if (msg.includes('permission denied') && msg.includes('banners')) {
      throw new Error(
        'Database permission error on banners. Run supabase/migrations/008_banners_service_role_grants.sql in the Supabase SQL Editor, then restart the dev server.'
      );
    }

    const fallback = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (fallback.error) throw fallback.error;

    const profileIds = [...new Set((fallback.data || []).map((b) => b.owner_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, bank_account')
      .in('id', profileIds);

    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

    const requests = await Promise.all(
      (fallback.data || []).map(async (row) => {
        const req = toAdminRequest(row, profileMap[row.owner_id]);
        req.documentUrls = await resolveDocumentUrls(row.document_urls);
        return req;
      })
    );

    return status ? requests.filter((r) => r.status === status) : requests;
  }

  const requests = await Promise.all(
    (data || []).map(async (row) => {
      const owner = row.owner || null;
      const req = toAdminRequest(row, owner);
      req.documentUrls = await resolveDocumentUrls(row.document_urls);
      return req;
    })
  );

  return requests;
}

export async function fetchAdminBannerById(bannerId) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');

  const { data: row, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', bannerId)
    .single();

  if (error || !row) return null;

  const { data: owner } = await supabase
    .from('profiles')
    .select('email, full_name, bank_account')
    .eq('id', row.owner_id)
    .maybeSingle();

  const req = toAdminRequest(row, owner);
  req.documentUrls = await resolveDocumentUrls(row.document_urls);
  return req;
}

export async function approveBanner(bannerId) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');

  const { data, error } = await supabase
    .from('banners')
    .update({
      status: 'approved',
      banner_status: 'active',
      rejection_reason: null,
    })
    .eq('id', bannerId)
    .eq('status', 'pending')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const { data: existing } = await supabase
      .from('banners')
      .select('status')
      .eq('id', bannerId)
      .single();
    if (existing?.status === 'approved') return { alreadyProcessed: true };
    throw new Error('Banner not found or no longer pending');
  }
  return { banner: data };
}

export async function rejectBanner(bannerId, reason) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');

  const { data, error } = await supabase
    .from('banners')
    .update({
      status: 'rejected',
      banner_status: 'pending_approval',
      rejection_reason: reason || 'Rejected by admin',
    })
    .eq('id', bannerId)
    .eq('status', 'pending')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const { data: existing } = await supabase
      .from('banners')
      .select('status')
      .eq('id', bannerId)
      .single();
    if (existing?.status === 'rejected') return { alreadyProcessed: true };
    throw new Error('Banner not found or no longer pending');
  }
  return { banner: data };
}
