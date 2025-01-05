import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { exerciseSets, exerciseSetsInsertSchemaType } from '@/db/schema';

type UpdateSetType = {
  id: number;
  reps?: number;
  weight?: number;
};
export const updateSet = async ({ id, reps, weight }: UpdateSetType) => {
  const updateData: { reps?: number; weight?: number } = {};

  if (reps !== undefined) {
    updateData.reps = reps;
  }

  if (weight !== undefined) {
    updateData.weight = weight;
  }
  await db.update(exerciseSets).set(updateData).where(eq(exerciseSets.id, id));
};

export const addSet = async ({
  exercisesRoutineId,
  order,
  reps,
  weight,
  type = 'default',
}: exerciseSetsInsertSchemaType) => {
  return await db
    .insert(exerciseSets)
    .values({
      type,
      exercisesRoutineId,
      order,
      reps,
      weight,
    })
    .returning();
};

export const deleteSet = async (id: number) => {
  await db.delete(exerciseSets).where(eq(exerciseSets.id, id));
};
