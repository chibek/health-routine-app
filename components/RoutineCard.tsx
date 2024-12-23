import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { Doc } from '@/db/types';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme/colors';

type RoutineCardProps = Doc<'routines'>;
const RoutineCard = ({ name, description, color }: RoutineCardProps) => {
  const borderColor = color ?? COLORS.light.grey5;

  return (
    <View
      className={cn('gap-4 rounded-lg border bg-white p-4 shadow-background')}
      style={{ borderColor }}>
      <View className="flex-1 flex-row justify-between">
        <Text className="text-lg font-bold">{name}</Text>
        <Ionicons name="ellipsis-horizontal-outline" size={24} />
      </View>
      <Text className="text-accent">{description}</Text>
      <Button size="lg">
        <Text>Empezar Rutina</Text>
      </Button>
    </View>
  );
};

export default RoutineCard;
