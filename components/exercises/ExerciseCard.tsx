import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import SetsRow from '@/components/sets/SetsRow';
import { DEFAULT_SET } from '@/db/constants';
import { exercisesSelectSchemaType } from '@/db/schema';
import { useSets } from '@/stores/sets';

type ExerciseCardProps = exercisesSelectSchemaType;

const ExerciseCard = ({ name, id }: ExerciseCardProps) => {
  const { sets, addSets, updateSets, removeSet } = useSets((state) => state);
  const filteredSets = sets.filter((set) => set.exerciseId === id);
  return (
    <View className="flex gap-6 bg-background">
      <View className="flex flex-row items-center gap-2">
        <Image src="https://picsum.photos/200" className="aspect-square size-16" />
        <Text>{name}</Text>
      </View>
      <View>
        <View className="flex-row items-center gap-6">
          <Text className="w-20 text-center text-xl font-bold">Serie</Text>
          <Text className="w-20 text-center text-xl font-bold">Peso</Text>
          <Text className="w-20 text-center text-xl font-bold">Reps</Text>
        </View>
        {filteredSets.map((serie) => (
          <SetsRow
            key={serie.order}
            {...serie}
            onUpdate={(field, value) =>
              updateSets({ order: serie.order, exerciseId: id, field, value })
            }
            onDelete={() => removeSet({ order: serie.order, exerciseId: id })}
          />
        ))}
      </View>
      <Button
        size="lg"
        className="w-full"
        onPress={() =>
          addSets([{ ...DEFAULT_SET, exerciseId: id, order: filteredSets.length + 1 }])
        }>
        <Ionicons name="add-circle-outline" size={24} />
        <Text>Agregar serie</Text>
      </Button>
    </View>
  );
};

export default ExerciseCard;
