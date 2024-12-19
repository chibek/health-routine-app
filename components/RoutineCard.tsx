import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { Doc } from '@/db/types';
import { cn } from '@/lib/cn';

type RoutineCardProps = Doc<'routines'>;
const RoutineCard = ({ name, description, color }: RoutineCardProps) => {
  const borderColor = color ? `border-[${color}]` : 'border-gray-400';

  return (
    <View className={cn('gap-4 rounded-lg border p-4', borderColor)}>
      <View className="flex-1 flex-row justify-between ">
        <Text className="text-lg font-bold">{name}</Text>

        <Ionicons name="ellipsis-horizontal-outline" size={24} />
      </View>
      <Text className="text-secondary">{description}</Text>
      <Button size="lg">
        <Text>Empezar Rutina</Text>
      </Button>
    </View>
  );
};

export default RoutineCard;
