import {
  type Href,
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
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
import * as yup from 'yup';
import { colors } from '../../constants/colors';
import { validateToFieldErrors } from '../../util/validateToFieldErrors';
import type { UserResponseBodyGet } from '../api/user+api';
import type { LoginResponseBodyPost } from './api/login+api';

const loginSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password is required'),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    width: '100%',
  },
  loginInputContainer: {
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

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | undefined>();

  const { returnTo } = useLocalSearchParams<{ returnTo: string }>();

  useFocusEffect(
    useCallback(() => {
      async function getUser() {
        const response = await fetch('/api/user');

        const responseBody: UserResponseBodyGet = await response.json();

        if ('username' in responseBody) {
          if (returnTo && typeof returnTo === 'string') {
            // Replace current route in the navigation stack with the new route
            // (prevents login screen appearing again with "go back" gesture)
            router.replace(returnTo as Href);
          }

          router.replace('/(tabs)/guests');
        }
      }

      getUser().catch((error) => {
        console.error(error);
      });
    }, [returnTo]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'username' && styles.inputFocused,
            fieldErrors.username && styles.inputError,
          ]}
          value={username}
          onChangeText={setUsername}
          onFocus={() => setFocusedInput('username')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.username && (
          <Text style={styles.errorText}>{fieldErrors.username}</Text>
        )}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'password' && styles.inputFocused,
            fieldErrors.password && styles.inputError,
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(undefined)}
        />
        {fieldErrors.password && (
          <Text style={styles.errorText}>{fieldErrors.password}</Text>
        )}
        <View style={styles.promptTextContainer}>
          <Text style={{ color: colors.text }}>Don't have an account?</Text>
          <Link href="/register" style={{ color: colors.text }}>
            Register
          </Link>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
        onPress={async () => {
          const validationResult = await validateToFieldErrors(loginSchema, {
            username,
            password,
          });

          if ('fieldErrors' in validationResult) {
            const errors = Object.fromEntries(validationResult.fieldErrors);
            setFieldErrors(errors);
            return;
          }

          // Clear errors if validation passes
          setFieldErrors({});

          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, attending: false }),
          });

          if (!response.ok) {
            let errorMessage = 'Error logging in';
            const responseBody: LoginResponseBodyPost = await response.json();
            if ('error' in responseBody) {
              errorMessage = responseBody.error;
            }

            Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
            return;
          }

          const responseBody: LoginResponseBodyPost = await response.json();

          if ('error' in responseBody) {
            Alert.alert('Error', responseBody.error, [{ text: 'OK' }]);
            return;
          }

          setUsername('');
          setPassword('');
          if (returnTo && typeof returnTo === 'string') {
            router.replace(returnTo as Href);
          } else {
            router.replace('/(tabs)/guests');
          }
        }}
      >
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
}
