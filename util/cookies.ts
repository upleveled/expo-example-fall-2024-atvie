import { serialize } from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  // Use secure cookies in production (HTTPS only)
  const isProduction = process.env.NODE_ENV === 'production';

  // Set cookie expiration to 24 hours
  const maxAge = 60 * 60 * 24;

  return serialize('sessionToken', token, {
    // Set max age for modern browsers
    maxAge: maxAge,
    // Set max age for older browsers
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}

export function deleteSerializedRegisterSessionTokenCookie() {
  const isProduction = process.env.NODE_ENV === 'production';

  return serialize('sessionToken', '', {
    maxAge: -1,
    expires: new Date(0),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}
