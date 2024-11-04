import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Note as NoteType } from '../../migrations/00003-createTableNotes';
import type { NoteResponseBodyGet } from '../api/notes/[noteId]+api';
import type { UserResponseBodyGet } from '../api/user+api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 10,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  textContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function Note() {
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<NoteType | null>(null);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function getUserAndLoadNote() {
        if (typeof noteId !== 'string') {
          return;
        }

        const [userResponse, noteResponse]: [
          UserResponseBodyGet,
          NoteResponseBodyGet,
        ] = await Promise.all([
          fetch('/api/user').then((response) => response.json()),
          fetch(`/api/notes/${noteId}`).then((response) => response.json()),
        ]);

        if ('error' in userResponse) {
          router.replace(`/(auth)/login?returnTo=/notes/${noteId}`);
        }

        if ('note' in noteResponse) {
          setNote(noteResponse.note);
        }
      }

      getUserAndLoadNote().catch((error) => {
        console.error(error);
      });
    }, [noteId, router]),
  );

  if (typeof noteId !== 'string') {
    return null;
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.textContent}>
          You do not have permission to access this note
        </Text>
        <Link href="/(tabs)/notes" style={{ color: colors.text }}>
          Back to notes
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.textContent}>{note.textContent}</Text>
      </View>
    </View>
  );
}
