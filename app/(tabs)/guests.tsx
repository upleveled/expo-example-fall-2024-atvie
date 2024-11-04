import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import GuestItem from '../../components/GuestItem';
import { colors } from '../../constants/colors';
import type { Guest } from '../../migrations/00000-createTableGuests';
import type { GuestsResponseBodyGet } from '../api/guests/index+api';
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

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isStale, setIsStale] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  const router = useRouter();

  // const renderItem = (item: { item: User }) => <UserItem user={item.item} />;

  const renderItem = (item: { item: Guest }) => (
    <GuestItem guest={item.item} setIsStale={setIsStale} />
  );

  useFocusEffect(
    useCallback(() => {
      if (!isStale) return;

      async function getUserAndGuests() {
        const [userResponse, guestsResponse]: [
          UserResponseBodyGet,
          GuestsResponseBodyGet,
        ] = await Promise.all([
          fetch('/api/user').then((response) => response.json()),
          fetch('/api/guests').then((response) => response.json()),
        ]);

        setIsStale(false);

        if ('error' in userResponse) {
          router.replace('/(auth)/login?returnTo=/(tabs)/guests');
          return;
        }

        if ('error' in guestsResponse) {
          setGuests([]);
          return;
        }

        setGuests(guestsResponse.guests);
      }

      getUserAndGuests().catch((error) => {
        console.error(error);
      });
    }, [isStale, router]),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={guests}
        renderItem={renderItem}
        keyExtractor={(item: Guest) => String(item.id)}
      />
    </SafeAreaView>
  );
}
