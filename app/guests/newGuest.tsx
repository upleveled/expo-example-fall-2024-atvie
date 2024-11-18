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

const guestSchema = yup.object({
  firstName: yup
    .string()
    .min(1, 'First name is required')
    .max(30, 'First name must be less than 30 characters'),
  lastName: yup
    .string()
    .min(1, 'Last name is required')
    .max(30, 'Last name must be less than 30 characters'),
});

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

export default function NewGuest() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | undefined>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addGuestContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'firstName' && styles.inputFocused,
            fieldErrors.firstName && styles.inputError,
          ]}
          value={firstName}
          onChangeText={setFirstName}
          onFocus={() => setFocusedInput('firstName')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.firstName && (
          <Text style={styles.errorText}>{fieldErrors.firstName}</Text>
        )}

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'lastName' && styles.inputFocused,
            fieldErrors.lastName && styles.inputError,
          ]}
          value={lastName}
          onChangeText={setLastName}
          onFocus={() => setFocusedInput('lastName')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.lastName && (
          <Text style={styles.errorText}>{fieldErrors.lastName}</Text>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const validationResult = await validateToFieldErrors(guestSchema, {
            firstName,
            lastName,
          });

          if ('fieldErrors' in validationResult) {
            const errors = Object.fromEntries(validationResult.fieldErrors);
            setFieldErrors(errors);
            return;
          }

          // Clear errors if validation passes
          setFieldErrors({});

          const response = await fetch('/api/guests', {
            method: 'POST',
            body: JSON.stringify({ firstName, lastName, attending: false }),
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

          setFirstName('');
          setLastName('');
          router.replace('/(tabs)/guests');
        }}
      >
        <Text style={styles.text}>Add Guest</Text>
      </Pressable>
    </SafeAreaView>
  );
}
