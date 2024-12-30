import { ZodError } from 'zod';

import { db } from '@/db/db';
import { exercises, exercisesInsertSchema, exercisesInsertSchemaType } from '@/db/schema';

type InsertExercisesType = {
  exercise: exercisesInsertSchemaType;
};
export const insertExercises = async ({ exercise }: InsertExercisesType) => {
  try {
    const exerciseParsed = exercisesInsertSchema.parse(exercise);
    const exerciseInserted = await db.insert(exercises).values(exerciseParsed).returning();
    return { success: true, result: exerciseInserted };
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, result: e.errors[0].message };
    }
    return { success: false, result: e };
  }
};
