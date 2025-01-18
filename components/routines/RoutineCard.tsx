import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import Animated, { FadeOutLeft } from 'react-native-reanimated';

import { Button } from '@/components/nativewindui/Button';
import RoutineOptions from '@/components/routines/RoutineOptions';
import { routinesSelectSchemaType } from '@/db/schema';
import { cn } from '@/lib/cn';
import { COLORS } from '@/theme/colors';

type RoutineCardProps = routinesSelectSchemaType;
const RoutineCard = ({ name, description, color, id }: RoutineCardProps) => {
  const borderColor = color ?? COLORS.light.grey5;

  return (
    <Animated.View
      exiting={FadeOutLeft}
      className={cn('gap-4 rounded-lg border bg-white p-4 shadow-lg shadow-background')}
      style={{ borderColor }}>
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold">{name}</Text>
        <RoutineOptions routineId={id} />
      </View>
      <Text className="text-accent">{description}</Text>
      <Link href={`/routine/${id}`} asChild>
        <Button size="lg">
          <Text>Empezar Rutina</Text>
        </Button>
      </Link>
    </Animated.View>
  );
};

export default RoutineCard;
