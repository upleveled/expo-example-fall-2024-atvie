import { type Href, Link, Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TabBarIcon } from '../../components/TabBarIcon';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 16,
  },
});

type Props = {
  href: Href<string>;
};

function HeaderRight({ href }: Props) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.headerRight}>
        <TabBarIcon name="add" color={colors.text} />
      </TouchableOpacity>
    </Link>
  );
}

export default function TabLayout() {
  const renderHeaderRight = (href: Href<string>) => <HeaderRight href={href} />;

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
          headerRight: () => renderHeaderRight('/guests/newGuest'),
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
          headerRight: () => renderHeaderRight('/notes/newNote'),
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
