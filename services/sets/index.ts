import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { exerciseSets } from '@/db/schema';

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
