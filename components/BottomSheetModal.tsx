import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import groupBy from 'just-group-by';
import { forwardRef, useMemo } from 'react';
import { Text, View } from 'react-native';

import { getWorkoutHistorySetsByRoutineId } from '@/services/workout-history';

interface Props {
  workoutRoutineId: number;
}
type Ref = BottomSheetModal;

const BottomWorkoutSheetModal = forwardRef<Ref, Props>(({ workoutRoutineId }, ref) => {
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // Ensure query function is passed correctly
  const { data } = useLiveQuery(getWorkoutHistorySetsByRoutineId(workoutRoutineId), [
    workoutRoutineId,
  ]);

  // If `data` is undefined or null, fallback to an empty array
  const groupedExercises = groupBy(
    data || [],
    (set) => set.exerciseSet?.exerciseRoutine?.exercise?.name || 'Unknown Exercise'
  );

  return (
    <BottomSheetModal enablePanDownToClose snapPoints={snapPoints} ref={ref} index={1}>
      <BottomSheetView>
        {Object.entries(groupedExercises).map(([exerciseName, sets]) => (
          <View key={exerciseName}>
            <Text style={{ fontWeight: 'bold' }}>{exerciseName}</Text>
            {sets.map((set, index) => (
              <View key={index}>
                <Text>Reps: {set.exerciseSet?.reps}</Text>
                <Text>Weight: {set.exerciseSet?.weight}</Text>
              </View>
            ))}
          </View>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomWorkoutSheetModal;
