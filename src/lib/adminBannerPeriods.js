import { getSupabaseAdmin } from './supabaseAdmin';
import { sendEmail, isEmailConfigured } from './sendEmailServer';
import { splitFullName } from './profileUtils';

function requireAdmin() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      'Admin database access is not configured. Add SUPABASE_SERVICE_ROLE_KEY to website/.env and restart the dev server.'
    );
  }
  return supabase;
}

function ownerLabel(ownerProfile) {
  if (!ownerProfile) return 'Not assigned';
  const name = ownerProfile.full_name?.trim();
  if (name) return name;
  return ownerProfile.email || 'Not assigned';
}

function toPeriodBanner(row) {
  const owner = row.owner;
  return {
    _id: row.id,
    id: row.id,
    location: row.location,
    start_date: row.start_date,
    end_date: row.end_date,
    banner_status: row.banner_status,
    status: row.status,
    ownerName: ownerLabel(owner),
    ownerEmail: owner?.email || null,
  };
}

export async function fetchBannerPeriodsAdmin() {
  const supabase = requireAdmin();

  const { data, error } = await supabase
    .from('banners')
    .select(
      'id, location, start_date, end_date, banner_status, status, owner:profiles!owner_id(email, full_name)'
    )
    .order('end_date', { ascending: true, nullsFirst: false });

  if (error) throw error;

  const statusCounts = {
    active: 0,
    expiring_soon: 0,
    expired: 0,
    pending_approval: 0,
  };

  const banners = (data || []).map((row) => {
    const mapped = toPeriodBanner(row);
    if (statusCounts[mapped.banner_status] !== undefined) {
      statusCounts[mapped.banner_status]++;
    }
    return mapped;
  });

  return { banners, statusCounts, total: banners.length };
}

export async function updateBannerStatusAdmin(bannerId, banner_status) {
  const supabase = requireAdmin();
  const allowed = ['pending_approval', 'active', 'expiring_soon', 'expired'];
  if (!allowed.includes(banner_status)) {
    throw new Error('Invalid banner status');
  }

  const { data, error } = await supabase
    .from('banners')
    .update({ banner_status, updated_at: new Date().toISOString() })
    .eq('id', bannerId)
    .select('id')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Banner not found');
  return data;
}

export async function renewBannerPeriodAdmin(bannerId, { startDate, endDate }) {
  if (!startDate || !endDate) {
    throw new Error('Start date and end date are required');
  }

  const supabase = requireAdmin();
  const { data, error } = await supabase
    .from('banners')
    .update({
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      banner_status: 'active',
      expiry_notification_sent: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bannerId)
    .select('id')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Banner not found');
  return data;
}

async function sendExpiryNotification(banner, owner) {
  if (!owner?.email || !isEmailConfigured()) return false;

  const endDate = banner.end_date ? new Date(banner.end_date) : null;
  if (!endDate) return false;

  const daysUntilExpiry = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
  const { firstName, lastName } = splitFullName(owner.full_name);
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'there';

  const subject = 'Banner contract expiring soon — Yaftty';
  const text = `Hi ${name}, your banner at ${banner.location} expires in ${daysUntilExpiry} days (${endDate.toLocaleDateString()}). Contact Yaftty to renew.`;
  const html = `
    <p>Hi ${name},</p>
    <p>Your banner contract at <strong>${banner.location}</strong> expires in <strong>${daysUntilExpiry}</strong> day(s) on ${endDate.toLocaleDateString()}.</p>
    <p>Please contact Yaftty to renew if you want to keep this listing active.</p>
  `;

  await sendEmail({ to: owner.email, subject, text, html });
  return true;
}

export async function runBannerStatusUpdatesAdmin() {
  const supabase = requireAdmin();
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: rows, error } = await supabase
    .from('banners')
    .select(
      'id, location, end_date, banner_status, expiry_notification_sent, owner:profiles!owner_id(email, full_name)'
    )
    .not('end_date', 'is', null);

  if (error) throw error;

  let updatedCount = 0;
  let notificationCount = 0;

  for (const banner of rows || []) {
    const endDate = new Date(banner.end_date);
    const isExpired =
      endDate < now && ['active', 'expiring_soon'].includes(banner.banner_status);
    const isExpiringSoon =
      endDate >= now &&
      endDate <= sevenDaysFromNow &&
      banner.banner_status === 'active' &&
      !banner.expiry_notification_sent;

    if (isExpired) {
      const { error: upErr } = await supabase
        .from('banners')
        .update({ banner_status: 'expired', updated_at: now.toISOString() })
        .eq('id', banner.id);
      if (!upErr) updatedCount++;
      continue;
    }

    if (isExpiringSoon) {
      const { error: upErr } = await supabase
        .from('banners')
        .update({
          banner_status: 'expiring_soon',
          expiry_notification_sent: true,
          updated_at: now.toISOString(),
        })
        .eq('id', banner.id);
      if (upErr) continue;
      updatedCount++;
      try {
        const sent = await sendExpiryNotification(banner, banner.owner);
        if (sent) notificationCount++;
      } catch (err) {
        console.error('Expiry notification failed:', err);
      }
    }
  }

  return { updatedCount, notificationCount };
}
