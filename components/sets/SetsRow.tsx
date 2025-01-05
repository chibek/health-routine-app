import { Ionicons } from '@expo/vector-icons';
import { useContext, useRef, useState } from 'react';
import { LayoutAnimation, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeOutLeft } from 'react-native-reanimated';
import { useStore } from 'zustand';

import RightAction from '@/components/SwipeableRow';
import { exerciseSetsSelectSchemaType } from '@/db/schema';
import { cn } from '@/lib/cn';
import { deleteSet, updateSet } from '@/services/sets';
import { SetsContext } from '@/stores/sets';
import { COLORS } from '@/theme/colors';
type SetsRowProps = exerciseSetsSelectSchemaType & {
  oldReps?: number;
  oldWeight?: number;
};
const SetsRow = ({ id, order, reps, weight, oldReps, oldWeight }: SetsRowProps) => {
  const reanimatedRef = useRef<SwipeableMethods>(null);

  const [isChecked, setChecked] = useState(false);
  const store = useContext(SetsContext);
  if (!store) throw new Error('Missing SetsContext.Provider in the tree');
  const updateSets = useStore(store, (s) => s.updateSets);
  const removeSet = useStore(store, (s) => s.removeSet);

  const handleUpdateAction = (field: 'weight' | 'reps', value: string) => {
    if (/^\d+$/.test(value)) {
      updateSets({ field, value, id });
    }
  };
  const handleCompleteSet = () => {
    setChecked((value) => !value);
  };

  const handleOnEndEditing = async (field: 'weight' | 'reps', value?: string) => {
    const updateData: { reps?: number; weight?: number } = {};
    if (field === 'reps' && value) {
      updateData.reps = Number(value);
    }
    if (field === 'weight' && value) {
      updateData.weight = Number(value);
    }
    await updateSet({ id, ...updateData });
  };

  const onTouchAction = async () => {
    await deleteSet(id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removeSet({ id });
    reanimatedRef.current?.close();
  };

  return (
    <Animated.View exiting={FadeOutLeft}>
      <ReanimatedSwipeable
        ref={reanimatedRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={() => <RightAction onDelete={() => onTouchAction()} />}
        containerStyle={{ backgroundColor: COLORS.light.destructiveForeground }}>
        <View
          className={cn(
            'flex-row items-center gap-6 bg-white py-4',
            isChecked && 'bg-green-100',
            !isChecked && order % 2 === 0 && 'bg-gray-200'
          )}>
          <Text className="h-8 w-20 text-center text-lg font-semibold">{order}</Text>
          <TextInput
            className="h-8 w-20 text-center text-lg font-semibold placeholder:text-gray-400"
            keyboardType="numeric"
            placeholder={oldWeight ? oldWeight.toString() : '-'}
            style={{ textAlignVertical: 'center', textAlign: 'center' }}
            value={weight?.toString()}
            onChangeText={(value) => handleUpdateAction('weight', value)}
            onEndEditing={(e) => handleOnEndEditing('weight', e.nativeEvent.text)}
          />
          <TextInput
            className="h-8 w-20 text-center text-lg font-semibold placeholder:text-gray-400"
            keyboardType="numeric"
            value={reps?.toString()}
            placeholder={oldReps ? oldReps.toString() : '-'}
            onChangeText={(value) => handleUpdateAction('reps', value)}
            onEndEditing={(e) => handleOnEndEditing('reps', e.nativeEvent.text)}
          />
          <View className="grow items-center">
            <TouchableOpacity onPress={() => handleCompleteSet()}>
              <View className={cn('size-6 rounded-lg bg-gray-400', isChecked && 'bg-green-500 ')}>
                {isChecked ? <Ionicons name="checkmark" size={24} color="#fff" /> : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
};

export default SetsRow;
