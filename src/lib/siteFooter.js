export const PAGES_WITH_MARKETING_FOOTER = ['/', '/help'];

export const AUTH_PAGES_WITHOUT_SITE_FOOTER = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/2fa-verification',
  '/choose-account-type',
];

/** Full-bleed app views — language in profile / map filters; no bottom footer bar */
export const PAGES_WITHOUT_SITE_FOOTER = [
  ...AUTH_PAGES_WITHOUT_SITE_FOOTER,
  '/profile',
  '/map',
  '/cart',
  '/checkout',
];

export function normalizePathname(pathname) {
  if (!pathname) return '/';
  const path = pathname.split('?')[0].split('#')[0];
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function shouldShowSupportChat(pathname) {
  const path = normalizePathname(pathname);
  return !path.startsWith('/admin');
}

export function shouldShowSiteAppFooter(pathname) {
  const path = normalizePathname(pathname);
  if (path.startsWith('/admin')) return false;
  if (PAGES_WITH_MARKETING_FOOTER.includes(path)) return false;
  if (PAGES_WITHOUT_SITE_FOOTER.includes(path)) return false;
  return true;
}
