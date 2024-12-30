import { exercisesSelectSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';

interface ExerciseState {
  exercises: exercisesSelectSchemaType[];
  addExercises: (by: exercisesSelectSchemaType[]) => void;
  removeAllExercises: () => void;
  exercisesById: Record<number, exercisesSelectSchemaType>;
}

export const useExercises = create<ExerciseState>()((set, get) => ({
  exercises: [],
  addExercises: (newExercises) =>
    set((state) => ({ exercises: [...state.exercises, ...newExercises] })),
  removeAllExercises: () => set({ exercises: [] }),
  exercisesById: get()?.exercises.reduce(
    (acc, exercise) => {
      if (!exercise.id) return acc;
      acc[exercise.id] = exercise;
      return acc;
    },
    {} as Record<number, exercisesSelectSchemaType>
  ),
}));
