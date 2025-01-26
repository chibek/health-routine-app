import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';

const EmptyExercises = () => {
  return (
    <View className="justify-top mt-2 flex-1 items-center gap-4 p-4">
      <Ionicons name="barbell-sharp" color="#4b5563" size={44} />
      <Text className="text-lg text-gray-600">Empieza agregando un ejercicio a tu rutina</Text>
      <Link href="/new-routine/add-exercise" asChild>
        <Button size="lg" className="w-full">
          <Ionicons name="add" size={20} />
          <Text className="text-lg">Agregar ejercicio</Text>
        </Button>
      </Link>
    </View>
  );
};

export default EmptyExercises;
