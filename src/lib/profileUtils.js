/** Normalize DB account_type to values the React app expects */
export function toUiAccountType(accountType) {
  if (accountType === 'banner_owner') return 'bannerOwner';
  return accountType;
}

export function toDbAccountType(accountType) {
  if (accountType === 'bannerOwner' || accountType === 'banner_owner') {
    return 'banner_owner';
  }
  return 'advertiser';
}

export function splitFullName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
  };
}

/** Map Supabase profile row → legacy user object used across the app */
export function profileToUser(profile) {
  if (!profile) return null;
  const { firstName, lastName } = splitFullName(profile.full_name);
  return {
    _id: profile.id,
    id: profile.id,
    authId: profile.auth_id,
    email: profile.email,
    fullName: profile.full_name,
    firstName,
    lastName,
    accountType: toUiAccountType(profile.account_type),
    bankAccount: profile.bank_account || {},
    isVerified: profile.is_verified,
    isApproved: profile.is_approved,
    twoFactorEnabled: profile.two_factor_enabled,
  };
}

export const ACTIVE_PROFILE_KEY = 'yaftty_active_profile_id';
