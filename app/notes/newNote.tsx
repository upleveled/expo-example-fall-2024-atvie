import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import type { GuestsResponseBodyPost } from '../api/guests/guests+api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    width: '100%',
  },
  addGuestContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    color: colors.text,
    backgroundColor: colors.background,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  inputFocused: {
    borderColor: colors.white,
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.text,
    padding: 12,
    borderRadius: 12,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
  },
  text: {
    fontFamily: 'Poppins_400Regular',
    color: colors.cardBackground,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | undefined>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addGuestContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'title' && styles.inputFocused,
          ]}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedInput('title')}
          onBlur={() => setFocusedInput(undefined)}
        />
        <Text style={styles.label}>Text</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'textContent' && styles.inputFocused,
          ]}
          numberOfLines={4}
          multiline={true}
          value={textContent}
          onChangeText={setTextContent}
          onFocus={() => setFocusedInput('textContent')}
          onBlur={() => setFocusedInput(undefined)}
        />
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const response = await fetch('/api/notes/notes', {
            method: 'POST',
            body: JSON.stringify({ title, textContent }),
          });

          if (!response.ok) {
            let errorMessage = 'Error creating guest';
            const body: GuestsResponseBodyPost = await response.json();

            if ('error' in body) {
              errorMessage = body.error;
            }

            Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
            return;
          }

          setTitle('');
          setTextContent('');
          router.replace('/(tabs)/notes');
        }}
      >
        <Text style={styles.text}>Add Note</Text>
      </Pressable>
    </SafeAreaView>
  );
}
