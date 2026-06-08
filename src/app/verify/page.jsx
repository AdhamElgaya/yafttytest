import { Suspense } from 'react';
import VerifyCode from '@/views/VerifyCode';

export const metadata = { title: 'Verify Email', robots: { index: false } };

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <VerifyCode />
    </Suspense>
  );
}
