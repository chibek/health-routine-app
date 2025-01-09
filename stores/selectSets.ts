import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { exerciseSetsInsertSchemaType, exerciseSetsSelectSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';

export interface TemporarySet extends exerciseSetsInsertSchemaType {
  tempId: string;
  isPending: boolean;
}

interface SetsState {
  setsByExercise: Record<number, exerciseSetsSelectSchemaType[]>;
  pendingSets: Record<number, TemporarySet[]>;
  removedSets: number[];

  addSets: (exerciseId: number, sets: exerciseSetsInsertSchemaType[]) => void;
  updateSet: (
    exerciseId: number,
    setId: string | number,
    updates: Partial<exerciseSetsSelectSchemaType>
  ) => void;
  removeSet: (exerciseId: number, setId: string | number) => void;
  initializeSets: (exerciseId: number, sets: exerciseSetsSelectSchemaType[]) => void;
  clearPendingSets: () => void;
}

// Helper to generate temporary IDs
const generateTempId = () => `temp_${uuidv4()}`;

export const useSetsStore = create<SetsState>()((set) => ({
  setsByExercise: {},
  pendingSets: {},
  removedSets: [],

  addSets: (exerciseId, sets) => {
    const temporarySets: TemporarySet[] = sets.map((newSet) => ({
      ...newSet,
      tempId: generateTempId(),
      isPending: true,
    }));
    set((state) => ({
      setsByExercise: {
        ...state.setsByExercise,
        [exerciseId]: [...(state.setsByExercise[exerciseId] || [])],
      },
      pendingSets: {
        ...state.pendingSets,
        [exerciseId]: [...(state.pendingSets[exerciseId] || []), ...temporarySets],
      },
    }));
  },
  updateSet: (exerciseId, setId, updates) => {
    set((state) => ({
      setsByExercise: {
        ...state.setsByExercise,
        [exerciseId]: state.setsByExercise[exerciseId].map((set) => {
          if (typeof setId === 'string' && 'tempId' in set && set.tempId === setId) {
            return { ...set, ...updates };
          }
          if (typeof setId === 'number' && 'id' in set && set.id === setId) {
            return { ...set, ...updates };
          }
          return set;
        }),
      },
      pendingSets: {
        ...state.pendingSets,
        [exerciseId]: (state.pendingSets[exerciseId] || []).map((set) =>
          set.tempId === setId ? { ...set, ...updates } : set
        ),
      },
    }));
  },
  removeSet: (exerciseId, setId) => {
    set((state) => ({
      setsByExercise: {
        ...state.setsByExercise,
        [exerciseId]: state.setsByExercise[exerciseId].filter(
          (set) => !('tempId' in set && set.tempId === setId) && !('id' in set && set.id === setId)
        ),
      },
      pendingSets: {
        ...state.pendingSets,
        [exerciseId]: (state.pendingSets[exerciseId] || []).filter((set) => set.tempId !== setId),
      },
      removedSets: [...state.removedSets, ...(typeof setId === 'number' ? [setId] : [])],
    }));
  },
  initializeSets: (exerciseId, sets) => {
    set((state) => ({
      setsByExercise: {
        ...state.setsByExercise,
        [exerciseId]: sets,
      },
    }));
  },
  clearPendingSets: () => {
    set({ pendingSets: {} });
  },
}));
