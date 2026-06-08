import { supabase } from './supabase';
import { uploadFile } from './storage';
import { parseEgpAmount } from './money';

/** Map UI banner type → DB check constraint (RGB, Normal, Paper) */
export function mapBannerType(type) {
  if (type === 'RGB') return 'RGB';
  if (type === 'Paper') return 'Paper';
  return 'Normal';
}

export function rowToBanner(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    owner: row.owner_id,
    location: row.location,
    size: row.size,
    type: row.type,
    traffic: row.traffic,
    pricePerMonth: parseEgpAmount(row.price_per_month),
    coordinates: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    bannerImageUrl: row.banner_image_url,
    documentUrls: row.document_urls || [],
    status: row.status,
    banner_status: row.banner_status,
    createdAt: row.created_at,
  };
}

export async function fetchApprovedBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select(
      'id, owner_id, location, size, type, traffic, price_per_month, latitude, longitude, banner_image_url, document_urls, status, created_at'
    )
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return {
    success: true,
    banners: (data || []).map(rowToBanner),
  };
}

export async function fetchUserBanners(profileId) {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('owner_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToBanner);
}

export async function submitBannerRequest({
  ownerProfileId,
  location,
  size,
  type,
  traffic,
  pricePerMonth,
  coordinates,
  bannerImageUrl,
  bannerImageFile,
  documentFiles = [],
}) {
  if (!ownerProfileId) {
    throw new Error('You must be logged in as a banner owner.');
  }
  if (!location?.trim()) {
    throw new Error('Location is required.');
  }
  if (!size?.trim()) {
    throw new Error('Banner size is required.');
  }
  if (!coordinates?.latitude || !coordinates?.longitude) {
    throw new Error('Pin the banner location on the map.');
  }

  let imageUrl = bannerImageUrl;
  if (bannerImageFile) {
    imageUrl = await uploadFile(bannerImageFile, 'banner-images');
  }
  if (!imageUrl) {
    throw new Error('Banner image is required.');
  }

  const documentUrls = [];
  for (const doc of documentFiles) {
    const path = await uploadFile(doc, 'documents');
    documentUrls.push(path);
  }
  if (documentUrls.length === 0) {
    throw new Error('At least one document is required.');
  }

  const { data, error } = await supabase
    .from('banners')
    .insert({
      owner_id: ownerProfileId,
      location: location.trim(),
      size: size.trim(),
      type: mapBannerType(type),
      traffic: traffic || 'moderate',
      price_per_month: parseEgpAmount(pricePerMonth),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      banner_image_url: imageUrl,
      document_urls: documentUrls,
      status: 'pending',
      banner_status: 'pending_approval',
    })
    .select('*')
    .single();

  if (error) throw error;

  const banner = rowToBanner(data);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const res = await fetch('/api/banners/notify-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bannerId: banner.id }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('Admin notification failed:', errBody.error || res.status);
      }
    }
  } catch (notifyErr) {
    console.error('Admin notification error:', notifyErr);
  }

  return banner;
}

export async function deleteUserBanner(bannerId) {
  const { error } = await supabase.from('banners').delete().eq('id', bannerId);
  if (error) throw error;
  return { success: true };
}
