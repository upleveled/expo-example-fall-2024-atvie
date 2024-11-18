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
import * as yup from 'yup';
import { colors } from '../../constants/colors';
import { validateToFieldErrors } from '../../util/validateToFieldErrors';
import type { GuestsResponseBodyPost } from '../api/guests/index+api';

const noteSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  textContent: yup.string().min(5, 'Text must be at least 5 characters'),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    width: '100%',
  },
  addNoteContainer: {
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | undefined>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addNoteContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'title' && styles.inputFocused,
            fieldErrors.title && styles.inputError,
          ]}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedInput('title')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.title && (
          <Text style={styles.errorText}>{fieldErrors.title}</Text>
        )}
        <Text style={styles.label}>Text</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'textContent' && styles.inputFocused,
            fieldErrors.textContent && styles.inputError,
          ]}
          numberOfLines={4}
          multiline={true}
          value={textContent}
          onChangeText={setTextContent}
          onFocus={() => setFocusedInput('textContent')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.textContent && (
          <Text style={styles.errorText}>{fieldErrors.textContent}</Text>
        )}
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const validationResult = await validateToFieldErrors(noteSchema, {
            title,
            textContent,
          });

          if ('fieldErrors' in validationResult) {
            const errors = Object.fromEntries(validationResult.fieldErrors);
            setFieldErrors(errors);
            return;
          }

          // Clear errors if validation passes
          setFieldErrors({});

          const response = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify({ title, textContent }),
          });

          if (!response.ok) {
            let errorMessage = 'Error creating note';
            const responseBody: GuestsResponseBodyPost = await response.json();

            if ('error' in responseBody) {
              errorMessage = responseBody.error;
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
