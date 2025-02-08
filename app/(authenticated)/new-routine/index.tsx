import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { View, Text } from 'react-native';
import { toast } from 'sonner-native';

import { CustomTextInput } from '@/components/CustomTextInput';
import EmptyExercises from '@/components/exercises/EmptyExercises';
import NewExerciseCard from '@/components/exercises/NewExerciseCard';
import { Button } from '@/components/nativewindui/Button';
import { routinesInsertSchema, routinesInsertSchemaType } from '@/db/schema';
import { insertRoutine } from '@/services/routines';
import { useExercises } from '@/stores/exercises';
import { resetAllStores } from '@/stores/generic';
import { useSets } from '@/stores/sets';

type FormData = routinesInsertSchemaType;

const NewRoutine = () => {
  const router = useRouter();
  const exercises = useExercises((state) => state.exercises.sort((a, b) => a.id - b.id));
  const sets = useSets((state) => state.sets);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(routinesInsertSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await insertRoutine({
      insertRoutine: data,
      insertExercises: exercises,
      insertSets: sets,
    });
    if (!response.success) {
      toast.error('Error al crear rutina');
      router.dismiss();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.success('Rutina creada exitosamente');
    router.dismiss();
  };
  console.log({ sets });
  // Detect when the screen component is unmounted
  useEffect(() => {
    return () => {
      resetAllStores();
    };
  }, []);

  return (
    <View className="flex-1 gap-3 bg-background">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button size="lg" onPress={handleSubmit(onSubmit)}>
              <Text>Guardar</Text>
            </Button>
          ),
        }}
      />
      <View className="gap-4 px-4 pt-4">
        <CustomTextInput placeholder="Nombre de la rutina" name="name" control={control} />
        <CustomTextInput placeholder="Descripción" name="description" control={control} />
      </View>
      {!exercises.length ? (
        <EmptyExercises />
      ) : (
        <KeyboardAwareScrollView>
          <View className="flex gap-4 px-2 pb-12">
            {exercises.map((exercise) => (
              <NewExerciseCard key={exercise.id} {...exercise} />
            ))}
            <Link href="/new-routine/add-exercise" asChild>
              <Button size="lg" className="w-full">
                <Ionicons name="add-sharp" size={24} />
                <Text>Agregar ejercicio</Text>
              </Button>
            </Link>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};

export default NewRoutine;
