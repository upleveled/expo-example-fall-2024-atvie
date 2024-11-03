import { parse } from 'cookie';
import { deleteSession } from '../../../database/sessions';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import { deleteSerializedRegisterSessionTokenCookie } from '../../../util/cookies';

export type LogoutResponseBodyGet =
  | {
      message: string;
    }
  | {
      error: string;
      errorIssues?: { message: string }[];
    };

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<LogoutResponseBodyGet>> {
  // 1. Get the session token from the cookie
  const cookies = parse(request.headers.get('cookie') || '');

  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json(
      {
        error: 'No session token found',
      },
      {
        status: 401,
      },
    );
  }

  // 2. Delete the session from the database based on the token
  const session = await deleteSession(token);

  if (!session) {
    return ExpoApiResponse.json(
      {
        error: 'Session not found',
      },
      {
        status: 404,
      },
    );
  }

  const sessionDeleted = deleteSerializedRegisterSessionTokenCookie();

  return ExpoApiResponse.json(
    {
      message: 'Logged out',
    },
    {
      headers: {
        'Set-Cookie': sessionDeleted,
      },
    },
  );
}
