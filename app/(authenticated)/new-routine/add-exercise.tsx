import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Link, useNavigation, useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { Button } from '@/components/nativewindui/Button';
import { db } from '@/db/db';
import {
  categories,
  categoriesSelectSchemaType,
  exerciseCategories,
  exercises,
  exercisesSelectSchemaType,
} from '@/db/schema';
import { useCategory } from '@/stores/categories';
import { useExercises } from '@/stores/exercises';

const AddExercise = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const category = useCategory((state) => state.category);
  const resetCategory = useCategory((state) => state.resetCategory);
  const getExercisesWithCategories = db
    .select({
      id: exercises.id,
      name: exercises.name,
      image: exercises.image,
      description: exercises.description,
      createdAt: exercises.createdAt,
      updatedAt: exercises.updatedAt,
      category: categories,
    })
    .from(exercises)
    .leftJoin(exerciseCategories, eq(exercises.id, exerciseCategories.exerciseId))
    .leftJoin(categories, eq(exerciseCategories.categoryId, categories.id));
  const { data } = useLiveQuery(getExercisesWithCategories, []);

  const [filteredExercises, setFilteredExercises] = useState<ExerciseWithCategories[]>(data);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const removeAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isSelected = (id: number) => selectedIds.has(id);
  const addExercises = useExercises((state) => state.addExercises);

  // Updated filter function that considers both search query and category
  const filterExercises = useCallback(
    (query: string) => {
      if (!data) return [];

      return data.filter((exercise) => {
        const nameMatch = removeAccents(exercise.name)
          .toLowerCase()
          .includes(removeAccents(query.toLowerCase()));

        const categoryMatch =
          !category || category.id === -1 ? true : exercise.category?.id === category.id;

        return nameMatch && categoryMatch;
      });
    },
    [data, category]
  );

  // Effect to update filtered exercises when either search query or category changes
  useEffect(() => {
    setFilteredExercises(filterExercises(searchQuery));
  }, [filterExercises, searchQuery, category, data]);

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
          setSearchQuery(query);
        },
      },
    });
  }, [navigation]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }, []);

  const handleAddExercises = () => {
    const newExercises = data
      .filter((exercise) => selectedIds.has(exercise.id))
      .map((e) => ({
        id: e.id,
        name: e.name,
        image: e.image,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        description: e.description,
        categoryId: e.category?.id ?? null,
      }));
    addExercises(newExercises);
    router.dismiss();
  };

  const renderItem = useCallback(
    ({ item }: { item: ExerciseWithCategories }) => (
      <MemoizedExerciseItem
        item={item}
        isSelected={isSelected(item.id)}
        toggleSelection={toggleSelection}
      />
    ),
    [isSelected, toggleSelection]
  );

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <View className="flex items-start px-4 pb-2">
        <Link href="/(authenticated)/new-routine/add-category" asChild>
          <Button
            size="md"
            variant="secondary"
            className={category && category.id !== -1 ? 'bg-primary' : ''}>
            <Text className="text-base">Categorias</Text>
          </Button>
        </Link>
      </View>
      {selectedIds.size > 0 && (
        <View className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <Text className="font-medium text-black">
            {selectedIds.size}{' '}
            {selectedIds.size === 1 ? 'ejercicio seleccionado' : 'ejercicios seleccionados'}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <FlashList
          data={filteredExercises}
          renderItem={renderItem}
          estimatedItemSize={200}
          ItemSeparatorComponent={useCallback(
            () => (
              <View className="mx-4 h-px bg-gray-100" />
            ),
            []
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
          extraData={selectedIds}
        />
      </View>
      {selectedIds.size > 0 && (
        <View className="fixed px-4 pb-1">
          <Button size="lg" onPress={() => handleAddExercises()}>
            <Text>Agregar</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export type ExerciseWithCategories = Pick<
  exercisesSelectSchemaType,
  'id' | 'name' | 'description' | 'image'
> & {
  category: categoriesSelectSchemaType | null;
};

type ExerciseItemProps = {
  item: ExerciseWithCategories;
  isSelected: boolean;
  toggleSelection: (id: number) => void;
};

const ExerciseItem = ({ item, isSelected, toggleSelection }: ExerciseItemProps) => {
  const width = useSharedValue<number>(0);
  const animatedStyles = useAnimatedStyle(() => ({
    width: withTiming(width.value, { duration: 200 }),
  }));

  useEffect(() => {
    width.value = isSelected ? 5 : 0;
  }, [isSelected]);

  const handlePress = useCallback(() => {
    toggleSelection(item.id);
  }, [item.id, toggleSelection]);

  return (
    <TouchableOpacity
      className="mx-2 flex flex-row items-center gap-2 px-4 py-2"
      onPress={handlePress}>
      <Animated.View className="h-full rounded-lg bg-blue-500" style={animatedStyles} />
      <View className="overflow-hidden rounded-md">
        <Avatar alt="Exercise image">
          <AvatarImage
            source={{
              uri: item.image ?? undefined,
            }}
          />
          <AvatarFallback>
            <Text className="text-foreground">NUI</Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="flex-grow">
        <View className="flex gap-2">
          <Text
            className={`text-left text-base ${
              isSelected ? 'font-medium text-blue-600' : 'font-normal'
            }`}>
            {item.name}
          </Text>
          {item.category ? (
            <Text className="text-sm text-foreground">{item.category?.name}</Text>
          ) : null}
        </View>
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

const MemoizedExerciseItem = memo(ExerciseItem);

export default AddExercise;
