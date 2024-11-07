import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  view: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight + 20,
    paddingBottom: 20,
  },
});

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
            redirect
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="guests/[guestId]"
            options={{
              headerBackTitleVisible: false,
              title: '',
              headerTintColor: colors.text,
              headerStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
          <Stack.Screen
            name="notes/[noteId]"
            options={{
              headerBackTitleVisible: false,
              title: '',
              headerTintColor: colors.text,
              headerStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
          <Stack.Screen
            name="guests/newGuest"
            options={{
              presentation: 'modal',
              title: '',
              animation: 'slide_from_bottom',
              headerTintColor: colors.text,
              headerStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
          <Stack.Screen
            name="notes/newNote"
            options={{
              presentation: 'modal',
              title: '',
              animation: 'slide_from_bottom',
              headerTintColor: colors.text,
              headerStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
        </Stack>
      </View>
    </SafeAreaView>
  );
}
