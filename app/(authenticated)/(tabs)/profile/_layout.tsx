import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={{ headerTitle: 'Profile', headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  );
};

export default Layout;
