import { Suspense } from 'react';
import VerifyCode2FA from '@/views/VerifyCode2FA';

export const metadata = { title: '2FA Verification', robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      <VerifyCode2FA />
    </Suspense>
  );
}
