import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <Slot
      initialRouteName="Login"
      screenOptions={{
        unmountOnBlur: true,
      }}
    />
  );
}
