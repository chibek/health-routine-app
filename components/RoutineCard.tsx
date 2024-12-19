import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';

const RoutineCard = () => {
  return (
    <View className="gap-4 rounded-lg border border-gray-400 p-4">
      <View className="flex-1 flex-row justify-between ">
        <Text className="text-lg font-bold">Rutina 1</Text>
        <Ionicons name="options-outline" size={24} />
      </View>
      <Button size="lg">
        <Text>Empezar Rutina</Text>
      </Button>
    </View>
  );
};

export default RoutineCard;
