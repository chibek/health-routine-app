import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';

const EmptyExercises = () => {
  return (
    <View className="justify-top mt-2 flex-1 items-center gap-4 p-4">
      <Ionicons name="add-circle-outline" size={24} />
      <Text className="text-xl">Empieza agregando un ejercicio a tu rutina</Text>
      <Link href="/new-routine/new-exercise" asChild>
        <Button size="lg" className="w-full">
          <Ionicons name="add-circle-outline" size={24} />
          <Text>Agregar ejercicio</Text>
        </Button>
      </Link>
    </View>
  );
};

export default EmptyExercises;
