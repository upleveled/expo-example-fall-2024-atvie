import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Note as NoteType } from '../../migrations/00003-createTableNotes';
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

export default function Note() {
  const { noteId } = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [note, setNote] = useState<NoteType>();

  useFocusEffect(
    useCallback(() => {
      async function loadNote() {
        if (typeof noteId !== 'string') {
          return;
        }

        const response = await fetch(`/api/notes/${noteId}`);
        const responseBody: NoteResponseBodyGet = await response.json();

        if ('error' in responseBody) {
          setErrorMessage(responseBody.error);
          return;
        }

        setNote(responseBody.note);
        setErrorMessage(null);
      }

      loadNote().catch((error) => {
        console.error(error);
      });
    }, [noteId]),
  );

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error loading note {noteId}</Text>
        <Text style={styles.textContent}>{errorMessage}</Text>
        <Link href="/(tabs)/notes" style={{ color: colors.text }}>
          Back to notes
        </Link>
      </View>
    );
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
