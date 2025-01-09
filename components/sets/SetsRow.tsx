import { Ionicons } from '@expo/vector-icons';
import { FC, useRef, useState } from 'react';
import { LayoutAnimation, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeOutLeft } from 'react-native-reanimated';

import RightAction from '@/components/SwipeableRow';
import { exerciseSetsInsertSchemaType } from '@/db/schema';
import { cn } from '@/lib/cn';
import { useSetsStore } from '@/stores/selectSets';
import { COLORS } from '@/theme/colors';

type OldSetsRowProps = {
  oldReps?: number;
  oldWeight?: number;
  exerciseId: number;
};

type SetsRowProps = StoredSet & OldSetsRowProps;

const SetsRow: FC<SetsRowProps> = ({
  exerciseId,
  order,
  reps,
  weight,
  oldReps,
  oldWeight,
  ...set
}) => {
  const reanimatedRef = useRef<SwipeableMethods>(null);
  const { updateSet, removeSet } = useSetsStore((s) => s);
  const [isChecked, setChecked] = useState(false);

  // Helper to determine if we're dealing with a temporary or saved set
  const setId = 'tempId' in set ? set.tempId : set.id;

  const handleUpdateAction = async (field: 'weight' | 'reps', value: string) => {
    if (/^\d+$/.test(value)) {
      const updateData: Partial<BaseSet> = {};
      if (field === 'reps' && value) {
        updateData.reps = Number(value);
      }
      if (field === 'weight' && value) {
        updateData.weight = Number(value);
      }
      updateSet(exerciseId, setId, updateData);
    }
  };

  const handleCompleteSet = () => {
    setChecked((value) => !value);
  };

  const onTouchAction = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removeSet(exerciseId, setId);
    reanimatedRef.current?.close();
  };

  return (
    <Animated.View exiting={FadeOutLeft}>
      <ReanimatedSwipeable
        ref={reanimatedRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={() => <RightAction onDelete={onTouchAction} />}
        containerStyle={{ backgroundColor: COLORS.light.destructiveForeground }}>
        <View
          className={cn(
            'flex-row items-center gap-6 bg-white py-4',
            isChecked && 'bg-green-100',
            !isChecked && order % 2 === 0 && 'bg-gray-200',
            'tempId' in set && 'border-l-4 border-blue-400' // Visual indicator for pending sets
          )}>
          <Text className="h-8 w-20 text-center text-lg font-semibold">{order}</Text>
          <TextInput
            className="h-8 w-20 text-center text-lg font-semibold placeholder:text-gray-400"
            keyboardType="numeric"
            placeholder={oldWeight ? oldWeight.toString() : '-'}
            style={{ textAlignVertical: 'center', textAlign: 'center' }}
            value={weight?.toString()}
            onChangeText={(value) => handleUpdateAction('weight', value)}
          />
          <TextInput
            className="h-8 w-20 text-center text-lg font-semibold placeholder:text-gray-400"
            keyboardType="numeric"
            value={reps?.toString()}
            placeholder={oldReps ? oldReps.toString() : '-'}
            onChangeText={(value) => handleUpdateAction('reps', value)}
          />
          <View className="grow items-center">
            <TouchableOpacity onPress={handleCompleteSet}>
              <View className={cn('size-6 rounded-lg bg-gray-400', isChecked && 'bg-green-500')}>
                {isChecked && <Ionicons name="checkmark" size={24} color="#fff" />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
};

export default SetsRow;

// Add these types to your stores/selectSets.ts file if not already present
export type BaseSet = Pick<
  exerciseSetsInsertSchemaType,
  'reps' | 'weight' | 'restSeconds' | 'order' | 'type' | 'exercisesRoutineId'
>;

export interface TemporarySet extends BaseSet {
  tempId: string;
  isPending: boolean;
}

export interface SavedSet extends BaseSet {
  id: number;
}

export type StoredSet = SavedSet | TemporarySet;
