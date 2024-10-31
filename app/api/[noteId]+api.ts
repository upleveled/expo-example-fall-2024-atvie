import { parse } from 'cookie';
import { getNote } from '../../database/notes';
import { ExpoApiResponse } from '../../ExpoApiResponse';
import type { Note } from '../../migrations/00003-createTableNotes';

export type NoteResponseBodyGet =
  | {
      note: Note;
    }
  | {
      error: string;
    };

export async function GET(
  request: Request,
  { noteId }: { noteId: string },
): Promise<ExpoApiResponse<NoteResponseBodyGet>> {
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
  const note = await getNote(token, Number(noteId));

  if (!note) {
    return ExpoApiResponse.json(
      {
        error: `No note with id ${noteId} found`,
      },
      {
        status: 404,
      },
    );
  }
  return ExpoApiResponse.json({ note: note });
}
