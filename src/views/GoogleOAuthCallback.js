'use client';

import { useEffect } from 'react';

const GoogleOAuthCallback = () => {
  useEffect(() => {
    // Get the code from the URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && window.opener) {
      // Send the code to the main window
      window.opener.postMessage({ type: 'google-oauth-code', code }, window.location.origin);
      window.close();
    }
  }, []);

  return <div>Signing you in with Google...</div>;
};

export default GoogleOAuthCallback;
