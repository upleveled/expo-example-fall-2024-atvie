import { Link, Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TabBarIcon } from '../../components/TabBarIcon';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 16,
  },
});

function HeaderRightGuests() {
  return (
    <Link href="/guests/newGuest" asChild>
      <TouchableOpacity style={styles.headerRight}>
        <TabBarIcon name="add" color={colors.text} />
      </TouchableOpacity>
    </Link>
  );
}
function HeaderRightNotes() {
  return (
    <Link href="/notes/newNote" asChild>
      <TouchableOpacity style={styles.headerRight}>
        <TabBarIcon name="add" color={colors.text} />
      </TouchableOpacity>
    </Link>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.text,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="guests"
        options={{
          title: 'Guests',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({ name: focused ? 'list' : 'list-outline', color }),
          unmountOnBlur: true,
          headerRight: HeaderRightGuests,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({
              name: focused ? 'document-text' : 'document-text-outline',
              color,
            }),
          unmountOnBlur: true,
          headerRight: HeaderRightNotes,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) =>
            TabBarIcon({
              name: focused ? 'person' : 'person-outline',
              color,
            }),
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}
