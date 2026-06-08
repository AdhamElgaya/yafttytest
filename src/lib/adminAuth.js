/** Optional header guard for /api/admin/* (dashboard UI). */

export function verifyAdminApiSecret(request) {
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected) return true;

  const provided =
    request.headers.get('x-yaftty-admin-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();

  return provided === expected;
}

export function adminAuthErrorResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Unauthorized. Set ADMIN_API_SECRET in .env and enter it on the admin page.',
    }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}
