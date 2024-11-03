import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
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

  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  useFocusEffect(
    useCallback(() => {
      async function loadNote() {
        if (typeof noteId !== 'string') {
          return;
        }

        const response = await fetch(`/api/notes/${noteId}`);
        const body: NoteResponseBodyGet = await response.json();

        if ('note' in body) {
          setTitle(body.note.title);
          setTextContent(body.note.textContent);
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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.textContent}>{textContent}</Text>
      </View>
    </View>
  );
}
