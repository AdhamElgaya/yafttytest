import GoogleOAuthCallback from '@/views/GoogleOAuthCallback';

export const metadata = { title: 'Google Sign In', robots: { index: false } };

export default function Page() {
  return <GoogleOAuthCallback />;
}
