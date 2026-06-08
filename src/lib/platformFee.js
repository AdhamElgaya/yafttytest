/** Platform fees (EGP) after the launch free period */
export const PLATFORM_FEE_SINGLE_BANNER_EGP = 200;
export const PLATFORM_FEE_MULTI_BANNER_EGP = 300;
export const PLATFORM_FEE_TRIAL_MONTHS = 3;

/**
 * Yaftty launch date (ISO). Set YAFTTY_LAUNCH_DATE in env for production.
 * First PLATFORM_FEE_TRIAL_MONTHS after this date: no platform fees for anyone.
 */
export function getYafttyLaunchDate() {
  const fromEnv =
    process.env.YAFTTY_LAUNCH_DATE || process.env.NEXT_PUBLIC_YAFTTY_LAUNCH_DATE;
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim();
  return '2026-06-01';
}

/**
 * True during the company's first PLATFORM_FEE_TRIAL_MONTHS from launch (not per-user).
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isWithinPlatformFeeTrial(now = new Date()) {
  const start = new Date(getYafttyLaunchDate());
  if (Number.isNaN(start.getTime())) return false;
  const trialEnds = new Date(start);
  trialEnds.setMonth(trialEnds.getMonth() + PLATFORM_FEE_TRIAL_MONTHS);
  return now < trialEnds;
}

/**
 * @param {{ bannerCount: number, withinTrial?: boolean }} opts
 * @returns {number} EGP platform fee (0 during launch period)
 */
export function calculatePlatformFeeEgp({ bannerCount, withinTrial = false }) {
  const count = Math.max(1, Number(bannerCount) || 1);
  if (withinTrial) return 0;
  if (count <= 1) return PLATFORM_FEE_SINGLE_BANNER_EGP;
  return PLATFORM_FEE_MULTI_BANNER_EGP;
}

/**
 * @param {number} bannerCount
 * @returns {'single' | 'multi'}
 */
export function getPlatformFeeTier(bannerCount) {
  return Math.max(1, Number(bannerCount) || 1) <= 1 ? 'single' : 'multi';
}
