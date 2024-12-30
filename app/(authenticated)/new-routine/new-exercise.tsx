import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Image,
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/nativewindui/Button';
import { db } from '@/db/db';
import { exercises, exercisesSelectSchemaType } from '@/db/schema';
import { useExercises } from '@/stores/exercises';

const NewExercise = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { data } = useLiveQuery(db.select().from(exercises), []);

  const [filteredExercises, setFilteredExercises] = useState<exercisesSelectSchemaType[]>(data);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const removeAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isSelected = (id: number) => selectedIds.has(id);
  const addExercises = useExercises((state) => state.addExercises);

  useEffect(() => {
    setFilteredExercises(data);
  }, [data]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Lista de ejercicios',
        hideWhenScrolling: false,
        hideNavigationBar: false,
        placement: 'stacked',
        autoFocus: true,
        autoCapitalize: 'none',
        inputType: 'text',
        onChangeText: (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
          const query = event.nativeEvent.text;
          if (query.length > 0) {
            setFilteredExercises((exercises) => [
              ...exercises.filter((exercise) =>
                removeAccents(exercise.name).toLowerCase().includes(query.toLowerCase())
              ),
            ]);
          } else {
            setFilteredExercises(data);
          }
        },
      },
    });
  }, [navigation]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const handleAddExercises = () => {
    const newExercises = data.filter((exercise) => selectedIds.has(exercise.id));
    addExercises(newExercises);
    router.dismiss();
  };

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      {selectedIds.size > 0 && (
        <View className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <Text className="font-medium text-black">
            {selectedIds.size}{' '}
            {selectedIds.size === 1 ? 'ejercicio seleccionado' : 'ejercicios seleccionados'}
          </Text>
        </View>
      )}
      <FlashList
        data={filteredExercises}
        renderItem={({ item }) => (
          <ExerciseItem
            item={item}
            isSelected={isSelected(item.id)}
            toggleSelection={toggleSelection}
          />
        )}
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View className="mx-4 h-px bg-gray-100" />}
        contentContainerStyle={{ paddingVertical: 8 }}
        extraData={selectedIds}
      />
      {selectedIds.size > 0 && (
        <View className="fixed  px-4 pb-1">
          <Button size="lg" onPress={() => handleAddExercises()}>
            <Text>Agregar</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

type ExerciseItemProps = {
  item: exercisesSelectSchemaType;
  isSelected: boolean;
  toggleSelection: (id: number) => void;
};
const ExerciseItem = ({ item, isSelected, toggleSelection }: ExerciseItemProps) => {
  const width = useSharedValue<number>(0);
  const animatedStyles = useAnimatedStyle(() => ({
    width: withTiming(width.value, { duration: 200 }),
  }));
  const handleSelection = () => {
    width.value = isSelected ? 5 : 0;
  };
  useEffect(() => {
    handleSelection();
  }, [isSelected]);

  return (
    <TouchableOpacity
      className="mx-2 flex flex-row items-center gap-2 px-4 py-2"
      onPress={() => toggleSelection(item.id)}>
      <Animated.View className="h-full rounded-lg bg-blue-500" style={animatedStyles} />
      <View className="overflow-hidden rounded-md">
        <Image src="https://picsum.photos/200" className="aspect-square size-12" />
      </View>
      <View className="flex-1">
        <Text
          className={`text-left text-base ${
            isSelected ? 'font-medium text-blue-600' : 'font-normal'
          }`}>
          {item.name}
        </Text>
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
        {isSelected && <Text className="text-sm text-white">✓</Text>}
      </View>
    </TouchableOpacity>
  );
};
export default NewExercise;
