/** Must match Supabase Auth → Providers → Email → OTP length (and email template). */
export const EMAIL_OTP_LENGTH = Number(process.env.NEXT_PUBLIC_EMAIL_OTP_LENGTH) || 6;

export function emptyOtpCode() {
  return Array(EMAIL_OTP_LENGTH).fill('');
}
