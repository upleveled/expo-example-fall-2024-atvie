import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
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
import type { RegisterResponseBodyPost } from './api/register+api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    width: '100%',
  },
  registerInputContainer: {
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
  promptTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
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

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | undefined>();

  useFocusEffect(
    useCallback(() => {
      async function getUser() {
        const response = await fetch('/api/user');

        const responseBody: RegisterResponseBodyPost = await response.json();

        if ('username' in responseBody) {
          router.replace('/(tabs)/guests');
        }
      }

      getUser().catch((error) => {
        console.error(error);
      });
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.registerInputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'username' && styles.inputFocused,
          ]}
          value={username}
          onChangeText={setUsername}
          onFocus={() => setFocusedInput('username')}
          onBlur={() => setFocusedInput(undefined)}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'password' && styles.inputFocused,
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(undefined)}
        />
        <View style={styles.promptTextContainer}>
          <Text style={{ color: colors.text }}>Already have an account?</Text>
          <Link href="/(auth)/login" style={{ color: colors.text }}>
            Login
          </Link>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, attending: false }),
          });

          if (!response.ok) {
            let errorMessage = 'Error creating user';
            try {
              const responseBody: RegisterResponseBodyPost =
                await response.json();
              if ('error' in responseBody) {
                errorMessage = responseBody.error;
              }
            } catch {}

            Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
            return;
          }

          const responseBody: RegisterResponseBodyPost = await response.json();

          if ('error' in responseBody) {
            Alert.alert('Error', responseBody.error, [{ text: 'OK' }]);
            return;
          }

          setUsername('');
          setPassword('');
          router.replace('/(tabs)/guests');
        }}
      >
        <Text style={styles.text}>Register</Text>
      </Pressable>
    </SafeAreaView>
  );
}
