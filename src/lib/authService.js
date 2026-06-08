import { supabase } from './supabase';
import { isEmailVerificationSkipped } from './authConfig';
import {
  profileToUser,
  toDbAccountType,
  toUiAccountType,
  ACTIVE_PROFILE_KEY,
} from './profileUtils';

async function fetchProfilesForAuthUser(authId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', authId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getActiveProfile(authId, preferredProfileId) {
  const profiles = await fetchProfilesForAuthUser(authId);
  if (!profiles.length) return null;

  const storedId =
    preferredProfileId ||
    localStorage.getItem(ACTIVE_PROFILE_KEY) ||
    sessionStorage.getItem(ACTIVE_PROFILE_KEY);

  const match = storedId
    ? profiles.find((p) => p.id === storedId)
    : null;
  return match || profiles[0];
}

function authUserIsEmailVerified(authUser, profiles) {
  if (isEmailVerificationSkipped()) return true;
  return (
    Boolean(authUser?.email_confirmed_at) ||
    profiles.some((p) => p.is_verified)
  );
}

async function registerWithoutEmailVerification({
  email,
  password,
  fullName,
  accountType,
  bankAccount,
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      fullName,
      accountType,
      bankAccount,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw signInError;

  const payload = await buildAuthPayload(signInData.session, true);
  if (!payload.user) {
    throw new Error(
      'Account created but profile was not found. Run the Supabase profile migrations.'
    );
  }

  return {
    message: 'Account created successfully!',
    needsConfirmation: false,
    session: signInData.session,
    user: payload.user,
    token: payload.token,
  };
}

async function completeSecondAccountTypeSignup({
  session,
  authId,
  email,
  fullName,
  accountType,
  bankAccount,
  existingProfiles,
}) {
  const result = await addAccountTypeForExistingUser({
    authId,
    email,
    fullName,
    accountType,
    bankAccount,
  });

  const payload = await buildAuthPayload(session, true, result.profileId);
  if (!payload.user) {
    throw new Error('Account type added but profile could not be loaded.');
  }

  return {
    message: result.message,
    needsConfirmation: false,
    session,
    user: payload.user,
    token: payload.token,
    existingAccountType: toUiAccountType(existingProfiles[0].account_type),
    newAccountType: toUiAccountType(accountType),
  };
}

export function persistActiveProfile(profileId, rememberMe) {
  if (rememberMe) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
  } else {
    sessionStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

export function clearActiveProfile() {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
  sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
}

export async function buildAuthPayload(session, rememberMe, profileId) {
  const profile = await getActiveProfile(session.user.id, profileId);
  if (!profile) {
    return { session, user: null, token: session.access_token };
  }
  persistActiveProfile(profile.id, rememberMe);
  return {
    session,
    user: profileToUser(profile),
    token: session.access_token,
  };
}

export async function signUp({
  email,
  password,
  fullName,
  accountType,
  bankAccount = {},
}) {
  const dbAccountType = toDbAccountType(accountType);

  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUser = sessionData?.session?.user;
  if (sessionUser) {
    const sameEmail =
      sessionUser.email?.toLowerCase() === email?.trim().toLowerCase();
    if (sameEmail) {
      let existingProfiles = [];
      try {
        existingProfiles = await fetchProfilesForAuthUser(sessionUser.id);
      } catch {
        existingProfiles = [];
      }

      const hasType = existingProfiles.some(
        (p) => p.account_type === dbAccountType
      );
      if (hasType) {
        throw new Error(
          'You already have this account type. Sign in or switch account from your profile.'
        );
      }

      // Logged in, same email, adding second role (e.g. advertiser + banner owner)
      if (existingProfiles.length > 0) {
        if (!authUserIsEmailVerified(sessionUser, existingProfiles)) {
          throw new Error(
            'Please verify your email before adding another account type.'
          );
        }
        return completeSecondAccountTypeSignup({
          session: sessionData.session,
          authId: sessionUser.id,
          email,
          fullName,
          accountType: dbAccountType,
          bankAccount,
          existingProfiles,
        });
      }

      await supabase.auth.signOut();
    } else {
      await supabase.auth.signOut();
    }
  }

  // Existing auth user adding a second account type — sign in first (avoids new OTP email)
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (!signInError && signInData?.session?.user) {
    const existingProfiles = await fetchProfilesForAuthUser(signInData.user.id);
    if (existingProfiles.length > 0) {
      const hasType = existingProfiles.some((p) => p.account_type === dbAccountType);
      if (hasType) {
        throw new Error(
          'You already have this account type. Sign in or switch account from your profile.'
        );
      }
      if (authUserIsEmailVerified(signInData.user, existingProfiles)) {
        return completeSecondAccountTypeSignup({
          session: signInData.session,
          authId: signInData.user.id,
          email,
          fullName,
          accountType: dbAccountType,
          bankAccount,
          existingProfiles,
        });
      }
      throw new Error(
        'Please verify your email before adding another account type.'
      );
    }
  }

  if (isEmailVerificationSkipped()) {
    return registerWithoutEmailVerification({
      email,
      password,
      fullName,
      accountType: dbAccountType,
      bankAccount,
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        account_type: dbAccountType,
        bank_account: bankAccount,
      },
    },
  });

  if (error) {
    if (
      error.message?.toLowerCase().includes('already registered') ||
      error.message?.toLowerCase().includes('already exists')
    ) {
      return signUpSecondAccountType({
        email,
        password,
        fullName,
        accountType: dbAccountType,
        bankAccount,
      });
    }
    throw error;
  }

  const needsConfirmation = !data.session;
  return {
    message: needsConfirmation
      ? 'Verification code sent to your email.'
      : 'Account created successfully!',
    needsConfirmation,
    user: data.user,
    session: data.session,
  };
}

async function signUpSecondAccountType({
  email,
  password,
  fullName,
  accountType,
  bankAccount,
}) {
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw signInError;

  const existingProfiles = await fetchProfilesForAuthUser(signInData.user.id);
  if (!existingProfiles.length) {
    throw new Error(
      isEmailVerificationSkipped()
        ? 'No existing account found for this email. Sign up first.'
        : 'No existing account found. Complete email verification first, or sign up as a new user.'
    );
  }

  if (!authUserIsEmailVerified(signInData.user, existingProfiles)) {
    throw new Error(
      'Please verify your email before adding another account type.'
    );
  }

  return completeSecondAccountTypeSignup({
    session: signInData.session,
    authId: signInData.user.id,
    email,
    fullName,
    accountType,
    bankAccount,
    existingProfiles,
  });
}

async function addAccountTypeForExistingUser({
  authId,
  email,
  fullName,
  accountType,
  bankAccount,
}) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', authId)
    .eq('account_type', accountType)
    .maybeSingle();

  if (existing) {
    throw new Error(
      `An account with this email already exists for this account type.`
    );
  }

  const { data: inserted, error } = await supabase
    .from('profiles')
    .insert({
      auth_id: authId,
      email,
      full_name: fullName,
      account_type: accountType,
      bank_account: bankAccount,
      is_verified: true,
      is_approved: accountType === 'banner_owner' ? false : null,
    })
    .select('id')
    .single();

  if (error) {
    const code = error.code || error?.details?.code;
    if (code === '23503') {
      throw new Error(
        'Database setup: run 005_profiles_fix_complete.sql in Supabase SQL Editor (profiles must use auth.users).'
      );
    }
    throw error;
  }

  return {
    message:
      'Account type added. You can switch between accounts in your profile.',
    needsConfirmation: false,
    profileId: inserted.id,
  };
}

export async function signIn(email, password, rememberMe = false) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const payload = await buildAuthPayload(data.session, rememberMe);
  if (!payload.user) {
    throw new Error(
      'Profile not found. Run the SQL migration or complete email verification.'
    );
  }
  return payload;
}

export async function verifyEmailOtp(email, token) {
  if (isEmailVerificationSkipped()) {
    throw new Error('Email verification is disabled. Sign up or log in directly.');
  }
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
  if (error) throw error;

  // is_verified is set by DB trigger on auth.users email confirmation
  const payload = await buildAuthPayload(
    data.session,
    true,
    null
  );
  return payload;
}

export async function resendSignupOtp(email) {
  if (isEmailVerificationSkipped()) {
    return { message: 'Email verification is disabled.' };
  }
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw error;
  return { message: 'A new code has been sent to your email.' };
}

export async function signOut() {
  clearActiveProfile();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function switchAccountType(desiredType) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const dbType = toDbAccountType(desiredType);
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', session.user.id)
    .eq('account_type', dbType)
    .maybeSingle();

  if (error) throw error;
  if (!profile) {
    throw new Error(
      'You do not have this account type yet. Sign up for it from the registration page.'
    );
  }

  const rememberMe = Boolean(localStorage.getItem('token'));
  persistActiveProfile(profile.id, rememberMe);

  return {
    user: profileToUser(profile),
    token: session.access_token,
  };
}

/** Whether the logged-in user has a profile for the given UI account type. */
export async function hasAccountType(uiAccountType) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return false;

  const dbType = toDbAccountType(uiAccountType);
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', session.user.id)
    .eq('account_type', dbType)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function resetPasswordForEmail(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function verifyRecoveryOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  if (error) throw error;
  return data.session;
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function resendRecoveryOtp(email) {
  return resetPasswordForEmail(email);
}

export async function getInitialSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await getActiveProfile(session.user.id);
  if (!profile) return { session, user: null };
  return {
    session,
    user: profileToUser(profile),
    token: session.access_token,
  };
}

/**
 * Update name (and email) on every profile row for this auth user so
 * advertiser + banner owner accounts stay in sync.
 */
export async function updateUserProfileInfo({ firstName, lastName, email }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('Not authenticated');

  const fullName = `${String(firstName || '').trim()} ${String(lastName || '').trim()}`.trim();
  if (!fullName) throw new Error('First and last name are required');

  const updates = { full_name: fullName };
  if (email?.trim()) {
    updates.email = email.trim();
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('auth_id', session.user.id)
    .select('*');

  if (error) throw error;
  if (!profiles?.length) throw new Error('Profile not found');

  const storedId =
    localStorage.getItem(ACTIVE_PROFILE_KEY) ||
    sessionStorage.getItem(ACTIVE_PROFILE_KEY);
  const active =
    profiles.find((p) => p.id === storedId) ||
    (await getActiveProfile(session.user.id));

  return profileToUser(active || profiles[0]);
}
