import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Entrenamiento',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
};

export default Layout;
