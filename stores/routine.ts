import { routinesInsertSchemaType } from '@/db/schema';
import { create } from '@/stores/generic';
import { COLORS } from '@/theme/colors';

export const useRoutine = create<routinesInsertSchemaType>()((set, get) => ({
  name: '',
  color: COLORS.black,
  description: undefined,
  userId: undefined,
}));
