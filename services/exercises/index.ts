import { ZodError } from 'zod';

import { db } from '@/db/db';
import {
  exerciseCategories,
  exercises,
  exercisesInsertSchema,
  exercisesInsertSchemaType,
  InsertExercise,
} from '@/db/schema';

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

export async function insertExerciseWithCategories(exercise: InsertExercise) {
  const { categoryId, ...exerciseData } = exercise;
  try {
    const [insertedExercise] = await db
      .insert(exercises)
      .values({ ...exerciseData, categoryId })
      .returning();

    if (categoryId) {
      await db.insert(exerciseCategories).values({
        exerciseId: insertedExercise.id,
        categoryId,
      });
    }
    return { success: true, result: insertedExercise };
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, result: e.errors[0].message };
    }
    return { success: false, result: e };
  }
}
