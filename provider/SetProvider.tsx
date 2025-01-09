import { createContext, PropsWithChildren, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

import { exerciseSetsSelectSchemaType } from '@/db/schema';
import { initializeSetsStore } from '@/stores/sets';

export interface SetProps {
  sets: exerciseSetsSelectSchemaType[];
}
export interface SetStateSelect extends SetProps {
  addSets: (by: exerciseSetsSelectSchemaType[]) => void;
  updateSets: (by: { id: number; field: 'weight' | 'reps'; value: string }) => void;
  removeSet: (by: { id: number }) => void;
  removeAllSets: () => void;
}

// Context
export const SetsContext = createContext<StoreApi<SetStateSelect> | null>(null);

interface SetsProviderProps extends PropsWithChildren {
  initialSets?: exerciseSetsSelectSchemaType[];
}

export function SetsProvider({ children, initialSets }: SetsProviderProps) {
  // Initialize store with props
  const store = initializeSetsStore({ sets: initialSets ?? [] });

  return <SetsContext.Provider value={store}>{children}</SetsContext.Provider>;
}

// Custom hook to use the sets context
export function useSets<T>(selector: (state: SetStateSelect) => T): T {
  const store = useContext(SetsContext);

  if (!store) {
    throw new Error('Missing SetsContext.Provider in the tree');
  }

  return useStore(store, selector);
}
