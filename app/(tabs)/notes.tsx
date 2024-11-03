import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { Redirect, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import NoteItem from '../../components/NotesItem';
import { colors } from '../../constants/colors';
import type { Note } from '../../migrations/00003-createTableNotes';
import type { NotesResponseBodyGet } from '../api/notes/notes+api';
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

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const [isStale, setIsStale] = useState(true);

  const renderItem = (item: { item: Note }) => <NoteItem note={item.item} />;

  useFocusEffect(
    useCallback(() => {
      if (!isStale) return;

      async function getUser() {
        const response = await fetch('/api/user');

        const body: UserResponseBodyGet = await response.json();

        if ('error' in body) {
          return <Redirect href="/(auth)" />;
        }
      }

      async function getNotes() {
        const response = await fetch('/api/notes/notes');
        const body: NotesResponseBodyGet = await response.json();

        if ('error' in body) {
          setNotes([]);
        }

        if ('notes' in body) {
          setNotes(body.notes);
        }

        setIsStale(false);
      }

      getUser().catch((error) => {
        console.error(error);
      });

      getNotes().catch((error) => {
        console.error(error);
      });
    }, [isStale]),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item: Note) => String(item.id)}
      />
    </SafeAreaView>
  );
}
