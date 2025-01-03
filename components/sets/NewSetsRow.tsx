import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { type exerciseSetsInsertSchemaType } from '@/db/schema';
import { COLORS } from '@/theme/colors';

type NewSetsRowProps = exerciseSetsInsertSchemaType & {
  onUpdate: (field: 'weight' | 'reps', value: string) => void;
  onDelete: () => void;
};
const NewSetsRow = ({ order, reps, weight, onUpdate, onDelete }: NewSetsRowProps) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const handleUpdateAction = (field: 'weight' | 'reps', value: string) => {
    if (/^\d+$/.test(value)) {
      onUpdate(field, value);
    }
  };
  const handleActionSheet = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ['Delete', 'Cancel'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === 0) onDelete();
      }
    );
  }, [onDelete]);

  return (
    <View
      className="flex-row items-center gap-6 py-4"
      style={{ backgroundColor: order % 2 === 0 ? COLORS.light.grey5 : '#fff' }}>
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
        <TouchableOpacity onPress={() => handleActionSheet()}>
          <Ionicons name="trash-outline" style={{ color: COLORS.light.destructive }} size={26} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewSetsRow;
