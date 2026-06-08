'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function getAuthenticatedHomeRoute(accountType) {
  switch (accountType) {
    case 'bannerOwner':
    case 'banner_owner':
      return '/dashboard';
    case 'advertiser':
      return '/advertiser-dashboard';
    default:
      return '/profile';
  }
}

/**
 * Redirect authenticated users away from guest-only routes (login, signup).
 * Returns { ready } when the page may render the guest UI.
 */
export function useGuestOnly() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    router.replace(getAuthenticatedHomeRoute(user.accountType));
  }, [user, router]);

  // Show guest UI whenever there is no logged-in user (don't block on auth loading after sign-out)
  if (user) {
    return { ready: false, redirecting: true };
  }

  return { ready: true, redirecting: false };
}
