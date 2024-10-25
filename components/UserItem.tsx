import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 30,
  },
  text: {
    textAlign: 'center',
    color: colors.text,
    fontFamily: 'Poppins_400Regular',
  },
});

type Props = {
  user: {
    name: string;
  };
};

export default function UserItem({ user }) {
  const { name } = user;

  console.log(user);

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {name.first} {name.last}
      </Text>
    </View>
  );
}
