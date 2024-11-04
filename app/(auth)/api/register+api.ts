import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { createSessionInsecure } from '../../../database/sessions';
import { createUserInsecure, getUserInsecure } from '../../../database/users';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import {
  type User,
  userSchema,
} from '../../../migrations/00001-createTableUsers';
import { createSerializedRegisterSessionTokenCookie } from '../../../util/cookies';

export type RegisterResponseBodyPost =
  | {
      user: { username: User['username'] };
    }
  | { error: string; errorIssues?: { message: string }[] };

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponseBodyPost>> {
  // Task: Implement the user registration workflow with session

  // 1. Get the user data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(requestBody);

  if (!result.success) {
    return ExpoApiResponse.json(
      {
        error: 'Request does not contain user object',
        errorIssues: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Check if user already exist in the database
  const user = await getUserInsecure(result.data.username);

  if (user) {
    return ExpoApiResponse.json(
      {
        error: 'Username already taken',
      },
      {
        status: 401,
      },
    );
  }

  // 4. Hash the plain password from the user
  const passwordHash = await bcryptJs.hash(result.data.password, 12);

  // // 5. Save the user information with the hashed password in the database
  const newUser = await createUserInsecure(result.data.username, passwordHash);

  if (!newUser) {
    return ExpoApiResponse.json(
      {
        error: 'Registration failed',
      },
      {
        status: 500,
      },
    );
  }

  // 6. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 7. Create the session record
  const session = await createSessionInsecure(token, newUser.id);

  if (!session) {
    return ExpoApiResponse.json(
      {
        error: 'Sessions creation failed',
      },
      {
        status: 401,
      },
    );
  }

  const serializedCookie = createSerializedRegisterSessionTokenCookie(
    session.token,
  );

  return ExpoApiResponse.json(
    {
      user: {
        username: newUser.username,
      },
    },
    {
      // 8. Send the new cookie in the headers
      headers: {
        'Set-Cookie': serializedCookie,
      },
    },
  );
}
