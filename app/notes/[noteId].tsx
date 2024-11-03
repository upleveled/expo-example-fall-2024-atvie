import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Note } from '../../migrations/00003-createTableNotes';
import type { NoteResponseBodyGet } from '../api/notes/[noteId]+api';

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

export default function NotePage() {
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadNote() {
        if (typeof noteId !== 'string') {
          return;
        }

        const response = await fetch(`/api/notes/${noteId}`);
        const responseBody: NoteResponseBodyGet = await response.json();

        if ('note' in responseBody) {
          setNote(responseBody.note);
        }
      }

      loadNote().catch((error) => {
        console.error(error);
      });
    }, [noteId]),
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
