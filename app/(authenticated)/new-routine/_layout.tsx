import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { useExercises } from '@/stores/exercises';

const _layout = () => {
  const router = useRouter();
  //TODO: Clean all stores
  const cleanRoutineFormulary = useExercises((state) => state.removeAllExercises);
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Nueva rutina',
          headerLeft: () => (
            <Button
              variant="plain"
              onPress={() => {
                cleanRoutineFormulary();
                router.dismiss();
              }}>
              <Text>Cancel</Text>
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="new-exercise"
        options={{
          headerLargeTitle: true,
          title: 'Añadir ejercicios',
        }}
      />
    </Stack>
  );
};

export default _layout;
