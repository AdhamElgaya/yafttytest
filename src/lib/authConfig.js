/** When true: no signup OTP emails; users are confirmed via server API and signed in immediately. */
export function isEmailVerificationSkipped() {
  return (
    process.env.NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION === 'true' ||
    process.env.NEXT_PUBLIC_SKIP_EMAIL_VERIFICATION === '1'
  );
}
