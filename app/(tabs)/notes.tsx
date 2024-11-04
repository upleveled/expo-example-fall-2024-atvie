import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import NoteItem from '../../components/NoteItem';
import { colors } from '../../constants/colors';
import type { Note } from '../../migrations/00003-createTableNotes';
import type { NotesResponseBodyGet } from '../api/notes/index+api';
import type { UserResponseBodyGet } from '../api/user+api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    height: '100%',
  },
  text: {
    color: colors.text,
  },
  list: {
    marginTop: 30,
  },
});

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const [isStale, setIsStale] = useState(true);

  const renderItem = (item: { item: Note }) => <NoteItem note={item.item} />;

  useFocusEffect(
    useCallback(() => {
      if (!isStale) return;

      async function getUserAndNotes() {
        const [userResponse, notesResponse]: [
          UserResponseBodyGet,
          NotesResponseBodyGet,
        ] = await Promise.all([
          fetch('/api/user').then((response) => response.json()),
          fetch('/api/notes').then((response) => response.json()),
        ]);

        setIsStale(false);

        if ('error' in userResponse) {
          router.replace('/(auth)/login?returnTo=/(tabs)/notes');
          return;
        }

        if ('error' in notesResponse) {
          setNotes([]);
          return;
        }

        if ('notes' in notesResponse) {
          setNotes(notesResponse.notes);
        }
      }

      getUserAndNotes().catch((error) => {
        console.error(error);
      });
    }, [isStale, router]),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {notes.length > 0 ? (
        <FlatList
          style={styles.list}
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item: Note) => String(item.id)}
        />
      ) : (
        <Text style={styles.text}>No notes yet</Text>
      )}
    </SafeAreaView>
  );
}
