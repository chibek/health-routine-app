import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/nativewindui/Button';

const schema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type FormData = z.infer<typeof schema>;

const NewRoutine = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const onSubmit: SubmitHandler<FormData> = (data) => console.log({ data });

  return (
    <View className="flex-1 gap-3 bg-background p-3">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button onPress={handleSubmit(onSubmit)}>
              <Text>Guardar</Text>
            </Button>
          ),
        }}
      />
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              className="rounded-md rounded-b-none border border-border"
              placeholder="Nombre de la rutina"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && <Text>This is required.</Text>}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              className="rounded-md rounded-t-none border border-t-0 border-border"
              placeholder="Descripción"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="description"
        />
      </View>
      <View className="flex-1 items-center justify-center gap-4">
        <Ionicons name="add-circle-outline" size={24} />
        <Text className="text-xl">Empieza agregando un ejercicio a tu rutina</Text>
        <Link href="/new-routine/new-exercise" asChild>
          <Button size="lg" className="w-full">
            <Ionicons name="add-circle-outline" size={24} />
            <Text>Agregar ejercicio</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default NewRoutine;
