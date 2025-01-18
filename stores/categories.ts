import { categoriesSelectSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';

interface CategoryState {
  category?: categoriesSelectSchemaType;
  addCategory: (by: categoriesSelectSchemaType) => void;
  resetCategory: () => void;
}

export const useCategory = create<CategoryState>()((set, get) => ({
  category: undefined,
  addCategory: (newCategory) => set(() => ({ category: newCategory })),
  resetCategory: () => set(() => ({ category: undefined })),
}));
