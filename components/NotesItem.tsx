import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { Note } from '../migrations/00003-createTableNotes';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: colors.text,
  },
  textContent: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: colors.text,
  },
});

type Props = {
  note: Note;
};

export default function NoteItem({ note }: Props) {
  const { id, title, textContent } = note;

  return (
    <Link href={`/notes/${id}`} asChild>
      <Pressable>
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.textContent}>{textContent}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
