import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { exercises } from '@/db/schema';
import { Doc } from '@/db/types';
import { useDrizzleDb } from '@/lib/useDB';

const NewExercise = () => {
  const db = useDrizzleDb();
  const navigation = useNavigation();
  const { data } = useLiveQuery(db.select().from(exercises), []);
  const [filteredExercises, setFilteredExercises] = useState<Doc<'exercises'>[]>(data);

  const removeAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  useEffect(() => {
    setFilteredExercises(data);
  }, [data]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'List of exercises',
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

  return (
    <SafeAreaView className="flex-1">
      <FlashList
        data={filteredExercises}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4">
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth }} />}
      />
    </SafeAreaView>
  );
};

export default NewExercise;
