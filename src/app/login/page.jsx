import { Suspense } from 'react';
import Login from '@/views/Login';

export const metadata = { title: 'Sign In', robots: { index: false } };

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <Login />
    </Suspense>
  );
}
