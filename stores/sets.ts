import { createContext } from 'react';

import { exerciseSetsInsertSchemaType, exerciseSetsSelectSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';

type RemoveSet = {
  order: number;
  exerciseId: number;
};
type UpdateSets = RemoveSet & {
  field: 'weight' | 'reps';
  value: string;
};

export type StoreSet = exerciseSetsInsertSchemaType & {
  exerciseId: number;
};

interface SetsState {
  sets: StoreSet[];
  addSets: (by: StoreSet[]) => void;
  getSetsByExerciseId: (by: number) => StoreSet[];
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

//Provider
interface SetProps {
  sets: exerciseSetsSelectSchemaType[];
}

interface SetStateSelect extends SetProps {
  addSets: (by: exerciseSetsSelectSchemaType[]) => void;
  updateSets: (by: { id: number; field: 'weight' | 'reps'; value: string }) => void;
  removeSet: (by: { id: number }) => void;
  removeAllSets: () => void;
}

export const SetsContext = createContext<SetsStore | null>(null);
type SetsStore = ReturnType<typeof createSetsStore>;

export const createSetsStore = (initProps?: Partial<SetProps>) => {
  const DEFAULT_PROPS: SetProps = {
    sets: [],
  };
  return create<SetStateSelect>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    addSets: (newSets) => set((state) => ({ sets: [...state.sets, ...newSets] })),
    updateSets: ({ id, field, value }) =>
      set((state) => ({
        sets: state.sets.map((set) =>
          set.id === id
            ? { ...set, [field]: value === '' || /^\d+$/.test(value) ? null : parseInt(value, 10) }
            : set
        ),
      })),
    removeAllSets: () => set({ sets: [] }),
    removeSet: ({ id }) =>
      set((state) => {
        const updatedSets = state.sets.filter((set) => !(set.id === id));
        return { ...state, sets: updatedSets };
      }),
  }));
};
