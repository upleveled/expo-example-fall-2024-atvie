import { parse } from 'cookie';
import { createNote, getNotes } from '../../../database/notes';
import { ExpoApiResponse } from '../../../ExpoApiResponse';
import {
  type Note,
  noteSchema,
} from '../../../migrations/00003-createTableNotes';

export type NotesResponseBodyGet =
  | {
      notes: Note[];
    }
  | {
      error: string;
      errorIssues?: { message: string }[];
    };

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<NotesResponseBodyGet>> {
  // 1. get the session token from the cookie
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json({
      error: 'No session token found',
    });
  }
  const notes = await getNotes(token);

  return ExpoApiResponse.json({
    notes: notes,
  });
}

export type NotesResponseBodyPost =
  | {
      note: Note;
    }
  | {
      error: string;
      errorIssues?: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<NotesResponseBodyPost>> {
  // 1. Get the note data from the request
  const requestBody = await request.json();

  // 2. Validate notes data with zod
  const result = noteSchema.safeParse(requestBody);

  if (!result.success) {
    return ExpoApiResponse.json(
      {
        error: 'Request does not contain note object',
        errorIssues: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the cookie
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json({
      error: 'No session token found',
    });
  }

  // 4. Create the note
  const newNote =
    token &&
    (await createNote(token, result.data.title, result.data.textContent));

  // 5. If the note creation fails, return an error
  if (!newNote) {
    return ExpoApiResponse.json(
      {
        error: 'Note not created or access denied creating note',
      },
      {
        status: 500,
      },
    );
  }

  // 6. Return the text content of the note
  return ExpoApiResponse.json({ note: newNote });
}
