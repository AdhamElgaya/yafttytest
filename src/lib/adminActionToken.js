import crypto from 'crypto';

function getSecret() {
  return (
    process.env.ADMIN_ACTION_SECRET ||
    process.env.ADMIN_API_SECRET ||
    process.env.GMAIL_PASS ||
    ''
  );
}

/** Signed token for approve/reject links in admin emails (7 days). */
export function createAdminActionToken(bannerId, action) {
  const secret = getSecret();
  if (!secret) throw new Error('ADMIN_ACTION_SECRET is not configured');

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${bannerId}:${action}:${exp}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyAdminActionToken(token) {
  const secret = getSecret();
  if (!secret || !token) return null;

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastColon = decoded.lastIndexOf(':');
    if (lastColon === -1) return null;

    const sig = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (sig !== expected) return null;

    const [bannerId, action, expStr] = payload.split(':');
    if (!bannerId || !['approve', 'reject'].includes(action)) return null;
    if (Date.now() > Number(expStr)) return null;

    return { bannerId, action };
  } catch {
    return null;
  }
}

export function buildEmailActionUrl(bannerId, action, baseUrl) {
  const token = createAdminActionToken(bannerId, action);
  const origin = (baseUrl || process.env.FRONTEND_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  return `${origin}/api/admin/email-action?token=${encodeURIComponent(token)}`;
}
