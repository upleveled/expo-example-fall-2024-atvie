import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    // Render all the pages in the (auth) group folder
    // https://docs.expo.dev/router/layouts/#:~:text=the%20above%20example%2C-,Slot,-will%20render%20the
    <Slot
      initialRouteName="Login"
      screenOptions={{
        unmountOnBlur: true,
      }}
    />
  );
}
