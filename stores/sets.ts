import { exerciseSetsInsertSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';

type RemoveSet = {
  order: number;
  exerciseId: number;
};
type UpdateSets = RemoveSet & {
  field: 'weight' | 'reps';
  value: string;
};

type AddSet = exerciseSetsInsertSchemaType & {
  exerciseId: number;
};

interface SetsState {
  sets: AddSet[];
  addSets: (by: AddSet[]) => void;
  getSetsByExerciseId: (by: number) => AddSet[];
  updateSets: (by: UpdateSets) => void;
  removeSet: (by: RemoveSet) => void;
  removeAllSets: () => void;
}

export const useSets = create<SetsState>()((set, get) => ({
  sets: [],
  addSets: (newSets) => set((state) => ({ sets: [...state.sets, ...newSets] })),
  getSetsByExerciseId: (exerciseId) => get().sets.filter((set) => set.exerciseId === exerciseId),
  updateSets: ({ order, exerciseId, field, value }) =>
    set((state) => ({
      sets: state.sets.map((set) =>
        set.order === order && set.exerciseId === exerciseId
          ? { ...set, [field]: value === '' || /^\d+$/.test(value) ? null : parseInt(value, 10) }
          : set
      ),
    })),
  removeAllSets: () => set({ sets: [] }),
  removeSet: ({ order, exerciseId }) =>
    set((state) => {
      const updatedSets = state.sets.filter(
        (set) => !(set.order === order && set.exerciseId === exerciseId)
      );
      const reorderedSets = updatedSets.map((set) => {
        if (set.exerciseId === exerciseId) {
          return {
            ...set,
            order: updatedSets.filter((s) => s.exerciseId === exerciseId).indexOf(set) + 1,
          };
        }
        return set;
      });
      return { ...state, sets: reorderedSets };
    }),
}));
