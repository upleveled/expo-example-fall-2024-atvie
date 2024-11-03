import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    // Prevent header from showing on auth group pages
    // https://docs.expo.dev/router/layouts/#:~:text=the%20above%20example%2C-,Slot,-will%20render%20the
    <Slot initialRouteName="Login" />
  );
}
