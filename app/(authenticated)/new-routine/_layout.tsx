import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { resetAllStores } from '@/stores/generic';
import { COLORS } from '@/theme/colors';

const _layout = () => {
  const router = useRouter();
  useEffect(() => {
    return () => {
      resetAllStores();
    };
  }, []);
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
                router.dismiss();
              }}>
              <Text className="text-base">Cancelar</Text>
            </Button>
          ),
          contentStyle: {
            borderTopColor: COLORS.light.grey4,
            borderTopWidth: 0.3,
          },
        }}
      />
      <Stack.Screen
        name="add-exercise"
        options={{
          headerLargeTitle: true,
          title: 'Añadir ejercicios',
          animation: 'slide_from_bottom',
          headerRight: () => (
            <Link href="/new-routine/new-exercise" asChild>
              <Button variant="plain">
                <Text className="text-base">Crear</Text>
              </Button>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="new-exercise"
        options={{
          headerLeft: () => (
            <Button
              variant="plain"
              onPress={() => {
                router.dismiss();
              }}>
              <Text className="text-base">Cancelar</Text>
            </Button>
          ),
          headerLargeTitle: false,
          title: 'Crear Ejercicio',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="add-category"
        options={{
          title: 'Seleccionar Categoría',
        }}
      />
    </Stack>
  );
};

export default _layout;
