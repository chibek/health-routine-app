import { exerciseSetsInsertSchemaType } from '@/db/schema';

export const DEFAULT_SET = {
  type: 'default',
  order: 1,
  reps: undefined,
  weight: undefined,
  rest_seconds: undefined,
} as Omit<exerciseSetsInsertSchemaType, 'exercisesRoutineId'>;
