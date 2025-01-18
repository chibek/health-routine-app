import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { CustomTextInput } from '@/components/CustomTextInput';
import { Button } from '@/components/nativewindui/Button';
import { exercisesInsertSchema } from '@/db/schema';
import { insertExerciseWithCategories } from '@/services/exercises';
import { useCategory } from '@/stores/categories';

type FormData = {
  name: string;
};
const NewExercise = () => {
  const router = useRouter();
  const category = useCategory((state) => state.category);
  const resetCategory = useCategory((state) => state.resetCategory);

  useEffect(() => {
    return () => {
      resetCategory();
    };
  }, []);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(exercisesInsertSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await insertExerciseWithCategories({
      name: data.name,
      categoryId: category?.id,
    });
    if (!response.success) {
      toast.error('Error al crear rutina');
      router.dismiss();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.success('Ejercicio creado exitosamente');
    router.dismiss();
  };

  return (
    <View className="flex-1 gap-6 p-2">
      <CustomTextInput control={control} name="name" placeholder="Nombre del ejercicio" />
      <Link href="/new-routine/add-category" asChild>
        <TouchableOpacity className="flex-row items-center justify-between border-y border-foreground py-2">
          <View className="flex gap-2">
            <Text className="font-bold">Categoria</Text>
            {category ? (
              <Text className="text-sm text-secondary">{category.name}</Text>
            ) : (
              <Text className="text-sm text-secondary">Seleccionar</Text>
            )}
          </View>
          <Ionicons name="chevron-forward-outline" size={20} />
        </TouchableOpacity>
      </Link>

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Guardar</Text>
      </Button>
    </View>
  );
};

export default NewExercise;
