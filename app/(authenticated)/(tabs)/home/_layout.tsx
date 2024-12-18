import { Stack } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => <Text>Right</Text>,
        }}
      />
    </Stack>
  );
};

export default Layout;
