import { serialize } from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  // Set cookie expiration to 24 hours
  const maxAge = 60 * 60 * 24;

  return serialize('sessionToken', token, {
    // Set max age for older browsers
    expires: new Date(Date.now() + maxAge * 1000),
    // Set max age for modern browsers
    maxAge: maxAge, // Cookie expires in 24 hours
    // Use secure cookies in production (HTTPS only)
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax', // Prevent sending cookie with images or frames of your content originating on other websites
  });
}

export function deleteSerializedRegisterSessionTokenCookie() {
  return serialize('sessionToken', '', {
    expires: new Date(0),
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
}
