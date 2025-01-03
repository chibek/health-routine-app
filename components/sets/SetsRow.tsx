import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';

import { exerciseSetsSelectSchemaType } from '@/db/schema';
import { cn } from '@/lib/cn';
import { SetsContext } from '@/stores/sets';

type SetsRowProps = exerciseSetsSelectSchemaType;
const SetsRow = ({ id, order, reps, weight }: SetsRowProps) => {
  const [isChecked, setChecked] = useState(false);
  const store = useContext(SetsContext);
  if (!store) throw new Error('Missing SetsContext.Provider in the tree');
  const updateSets = useStore(store, (s) => s.updateSets);

  const handleUpdateAction = (field: 'weight' | 'reps', value: string) => {
    if (/^\d+$/.test(value)) {
      updateSets({ field, value, id });
    }
  };
  const handleCompleteSet = () => {
    setChecked((value) => !value);
  };

  return (
    <View
      className={cn(
        'flex-row items-center gap-6 py-4',
        isChecked && 'bg-green-100/80',
        !isChecked && order % 2 === 0 && 'bg-gray-200'
      )}>
      <Text className="h-8 w-20 text-center text-lg font-semibold">{order}</Text>
      <TextInput
        className="h-8 w-20 text-center text-lg font-semibold placeholder:text-black"
        keyboardType="numeric"
        placeholder="-"
        style={{ textAlignVertical: 'center', textAlign: 'center' }}
        value={weight?.toString()}
        onChangeText={(value) => handleUpdateAction('weight', value)}
      />
      <TextInput
        className="h-8 w-20 text-center text-lg font-semibold placeholder:text-black"
        keyboardType="numeric"
        placeholder="-"
        value={reps?.toString()}
        onChangeText={(value) => handleUpdateAction('reps', value)}
      />
      <View className="grow items-center">
        <TouchableOpacity onPress={() => handleCompleteSet()}>
          <View className={cn('size-6 rounded-lg bg-gray-400', isChecked && 'bg-green-500 ')}>
            {isChecked ? <Ionicons name="checkmark" size={24} color="#fff" /> : null}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetsRow;
