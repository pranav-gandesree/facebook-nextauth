'use client';

import { signIn } from 'next-auth/react';

function Login() {
  return (
    <div className="grid place-items-center">
      <button
        onClick={async () =>
          await signIn('facebook', {
            callbackUrl: window.location.origin, 
          })
        }
      >
        Sign in with Facebook
      </button>
    </div>
  );
}

export default Login;
