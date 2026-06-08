import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';
import { parseEgpAmount } from './money';
import {
  calculatePlatformFeeEgp,
  isWithinPlatformFeeTrial,
} from './platformFee';

function monthsBetweenInclusive(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
  return Math.max(1, Math.ceil(days / 30));
}

export function estimateCampaignAmountEgp(pricePerMonth, startDate, endDate) {
  const monthly = parseEgpAmount(pricePerMonth);
  const months = monthsBetweenInclusive(startDate, endDate);
  return monthly * months;
}

async function getProfileByAuthId(authId, accountType = 'advertiser') {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error('Server database is not configured.');

  const { data, error } = await admin
    .from('profiles')
    .select('id, account_type, created_at, full_name, email')
    .eq('auth_id', authId)
    .eq('account_type', accountType)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getBannerForBooking(bannerId) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('banners')
    .select('id, owner_id, location, price_per_month, status, banner_status, start_date, end_date')
    .eq('id', bannerId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Banner not found.');
  if (data.status !== 'approved' || data.banner_status !== 'active') {
    throw new Error('This banner is not available for booking.');
  }
  return data;
}

/**
 * @param {string} authUserId Supabase auth user id
 * @param {Array<{
 *   bannerId: string,
 *   startDate: string,
 *   endDate: string,
 *   campaignDescription?: string,
 *   contentType?: string,
 *   contentUrls?: string[]
 * }>} items
 */
export async function createBookingOrderFromItems(authUserId, items) {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Booking is not configured on the server.');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one banner is required.');
  }

  const advertiser = await getProfileByAuthId(authUserId, 'advertiser');
  if (!advertiser) {
    throw new Error('Advertiser profile not found.');
  }

  const admin = getSupabaseAdmin();
  const withinTrial = isWithinPlatformFeeTrial();
  const bannerCount = items.length;
  const platformFeeEgp = calculatePlatformFeeEgp({ bannerCount, withinTrial });
  const isMultiBanner = bannerCount > 1;

  let campaignTotalEgp = 0;
  const bookingRows = [];

  for (const item of items) {
    const banner = await getBannerForBooking(item.bannerId);
    if (banner.owner_id === advertiser.id) {
      throw new Error('You cannot book your own banner.');
    }

    const amount = estimateCampaignAmountEgp(
      banner.price_per_month,
      item.startDate,
      item.endDate
    );
    campaignTotalEgp += amount;

    bookingRows.push({
      banner_id: banner.id,
      advertiser_id: advertiser.id,
      owner_id: banner.owner_id,
      start_date: item.startDate,
      end_date: item.endDate,
      status: 'pending',
      message: item.campaignDescription?.trim() || null,
      content_type: item.contentType || 'photo',
      content_urls: Array.isArray(item.contentUrls) ? item.contentUrls : [],
      total_price: amount,
    });
  }

  const { data: order, error: orderError } = await admin
    .from('booking_orders')
    .insert({
      advertiser_id: advertiser.id,
      banner_count: bannerCount,
      is_multi_banner: isMultiBanner,
      platform_fee_egp: platformFeeEgp,
      campaign_total_egp: campaignTotalEgp,
      status: 'pending',
    })
    .select('*')
    .single();

  if (orderError) throw orderError;

  const rowsWithOrder = bookingRows.map((row) => ({
    ...row,
    order_id: order.id,
  }));

  const { data: bookings, error: bookingsError } = await admin
    .from('bookings')
    .insert(rowsWithOrder)
    .select('*');

  if (bookingsError) throw bookingsError;

  return {
    order,
    bookings: bookings || [],
    platformFeeEgp,
    campaignTotalEgp,
    withinTrial,
    isMultiBanner,
  };
}

function normalizeBookingStatus(status) {
  if (status === 'accepted') return 'approved';
  return status;
}

async function syncBookingOrderStatus(orderId) {
  if (!orderId) return;

  const admin = getSupabaseAdmin();
  const { data: bookings, error } = await admin
    .from('bookings')
    .select('status')
    .eq('order_id', orderId);

  if (error || !bookings?.length) return;

  const statuses = bookings.map((b) => b.status);
  const hasPending = statuses.some((s) => s === 'pending');
  const allAccepted = statuses.every((s) => s === 'accepted');
  const hasRejected = statuses.some((s) => s === 'rejected');

  let nextStatus = 'pending';
  if (hasPending) {
    nextStatus = 'pending';
  } else if (allAccepted) {
    nextStatus = 'awaiting_payment';
  } else if (hasRejected) {
    nextStatus = 'cancelled';
  }

  await admin.from('booking_orders').update({ status: nextStatus }).eq('id', orderId);
}

function mapBookingRow(row, bannerMap, profileMap) {
  const banner = bannerMap.get(row.banner_id);
  const advertiser = profileMap.get(row.advertiser_id);
  const owner = profileMap.get(row.owner_id);
  return {
    _id: row.id,
    id: row.id,
    orderId: row.order_id,
    bannerId: row.banner_id,
    startDate: row.start_date,
    endDate: row.end_date,
    status: normalizeBookingStatus(row.status),
    message: row.message,
    campaignDescription: row.message,
    contentType: row.content_type,
    contentUrls: row.content_urls || [],
    contentFiles: row.content_urls || [],
    totalPrice: row.total_price,
    createdAt: row.created_at,
    banner: banner
      ? {
          _id: banner.id,
          location: banner.location,
          pricePerMonth: banner.price_per_month,
          size: banner.size,
          type: banner.type,
        }
      : null,
    advertiser: advertiser
      ? { _id: advertiser.id, fullName: advertiser.full_name, email: advertiser.email }
      : null,
    owner: owner
      ? { _id: owner.id, fullName: owner.full_name, email: owner.email }
      : null,
    ownerResponse: row.owner_response || null,
    rejectionNote: row.rejection_note || null,
  };
}

/**
 * Owner accepts or rejects a pending booking request.
 * @param {string} bookingId
 * @param {string} authUserId
 * @param {{ response: 'accepted' | 'rejected', rejectionNote?: string }} payload
 */
export async function respondToBookingRequest(bookingId, authUserId, payload) {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Booking is not configured on the server.');
  }

  const { response, rejectionNote } = payload;
  if (response !== 'accepted' && response !== 'rejected') {
    throw new Error('Invalid response.');
  }
  if (response === 'rejected' && !rejectionNote?.trim()) {
    throw new Error('Rejection reason is required.');
  }

  const owner = await getProfileByAuthId(authUserId, 'banner_owner');
  if (!owner) {
    throw new Error('Banner owner profile not found.');
  }

  const admin = getSupabaseAdmin();
  const { data: booking, error: fetchError } = await admin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('owner_id', owner.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!booking) throw new Error('Booking not found.');
  if (booking.status !== 'pending') {
    throw new Error('This booking request has already been handled.');
  }

  const statusUpdate = { status: response };
  const fullUpdate = {
    ...statusUpdate,
    owner_response: response === 'accepted' ? 'accepted' : null,
    rejection_note: response === 'rejected' ? rejectionNote.trim() : null,
  };

  let updated;
  let updateError;

  ({ data: updated, error: updateError } = await admin
    .from('bookings')
    .update(fullUpdate)
    .eq('id', bookingId)
    .select('*')
    .single());

  // Migration 012 adds owner_response / rejection_note — fall back if not applied yet
  if (
    updateError &&
    /owner_response|rejection_note|schema cache/i.test(updateError.message || '')
  ) {
    ({ data: updated, error: updateError } = await admin
      .from('bookings')
      .update(statusUpdate)
      .eq('id', bookingId)
      .select('*')
      .single());
  }

  if (updateError) throw updateError;

  if (updated.order_id) {
    await syncBookingOrderStatus(updated.order_id);
  }

  const [mapped] = await hydrateBookings([updated]);
  if (response === 'accepted') {
    mapped.ownerResponse = 'accepted';
  }
  if (response === 'rejected' && rejectionNote?.trim()) {
    mapped.rejectionNote = rejectionNote.trim();
  }
  return mapped;
}

const OWNER_DELETABLE_STATUSES = new Set(['accepted', 'rejected', 'cancelled']);
const ADVERTISER_DELETABLE_STATUSES = new Set(['rejected', 'cancelled']);

export async function deleteBookingRequest(bookingId, authUserId) {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Booking is not configured on the server.');
  }

  const admin = getSupabaseAdmin();
  const { data: booking, error: fetchError } = await admin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!booking) throw new Error('Booking not found.');

  if (booking.status === 'pending') {
    throw new Error('Pending bookings cannot be deleted. Cancel the request instead.');
  }
  if (booking.status === 'paid') {
    throw new Error('Paid bookings cannot be deleted.');
  }

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('id, account_type')
    .eq('auth_id', authUserId);

  if (profilesError) throw profilesError;

  const ownerProfile = (profiles || []).find((p) => p.account_type === 'banner_owner');
  const advertiserProfile = (profiles || []).find((p) => p.account_type === 'advertiser');

  const isOwner = ownerProfile && booking.owner_id === ownerProfile.id;
  const isAdvertiser = advertiserProfile && booking.advertiser_id === advertiserProfile.id;

  if (!isOwner && !isAdvertiser) {
    throw new Error('You do not have permission to delete this booking.');
  }

  if (isOwner && !OWNER_DELETABLE_STATUSES.has(booking.status)) {
    throw new Error('This booking cannot be deleted.');
  }

  if (isAdvertiser && !isOwner && !ADVERTISER_DELETABLE_STATUSES.has(booking.status)) {
    throw new Error('This booking cannot be deleted.');
  }

  const orderId = booking.order_id;

  const { error: deleteError } = await admin.from('bookings').delete().eq('id', bookingId);
  if (deleteError) throw deleteError;

  if (orderId) {
    const { data: remaining, error: remainingError } = await admin
      .from('bookings')
      .select('id')
      .eq('order_id', orderId);

    if (remainingError) throw remainingError;

    if (!remaining?.length) {
      await admin.from('booking_orders').delete().eq('id', orderId);
    } else {
      await syncBookingOrderStatus(orderId);
    }
  }

  return { id: bookingId };
}

export async function listBookingsForAdvertiserProfile(profileId) {
  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from('bookings')
    .select('*')
    .eq('advertiser_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return hydrateBookings(rows || []);
}

export async function listBookingsForOwnerProfile(profileId) {
  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from('bookings')
    .select('*')
    .eq('owner_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return hydrateBookings(rows || []);
}

async function hydrateBookings(rows) {
  if (!rows.length) return [];

  const admin = getSupabaseAdmin();
  const bannerIds = [...new Set(rows.map((r) => r.banner_id))];
  const profileIds = [
    ...new Set(rows.flatMap((r) => [r.advertiser_id, r.owner_id])),
  ];

  const [{ data: banners }, { data: profiles }] = await Promise.all([
    admin.from('banners').select('id, location, price_per_month, size, type').in('id', bannerIds),
    admin
      .from('profiles')
      .select('id, full_name, email')
      .in('id', profileIds),
  ]);

  const bannerMap = new Map((banners || []).map((b) => [b.id, b]));
  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  return rows.map((row) => mapBookingRow(row, bannerMap, profileMap));
}

export async function getBookingOrderForAdvertiser(orderId, authUserId) {
  const advertiser = await getProfileByAuthId(authUserId, 'advertiser');
  if (!advertiser) throw new Error('Advertiser profile not found.');

  const admin = getSupabaseAdmin();
  const { data: order, error: orderError } = await admin
    .from('booking_orders')
    .select('*')
    .eq('id', orderId)
    .eq('advertiser_id', advertiser.id)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) throw new Error('Order not found.');

  const { data: bookingRows, error: bookingsError } = await admin
    .from('bookings')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (bookingsError) throw bookingsError;

  const bookings = await hydrateBookings(bookingRows || []);

  return {
    order: {
      id: order.id,
      bannerCount: order.banner_count,
      isMultiBanner: order.is_multi_banner,
      platformFeeEgp: order.platform_fee_egp,
      campaignTotalEgp: order.campaign_total_egp,
      status: order.status,
      createdAt: order.created_at,
    },
    bookings,
    withinTrial: isWithinPlatformFeeTrial(),
  };
}
