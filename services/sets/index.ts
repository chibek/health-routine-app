import { eq, inArray, SQL, sql } from 'drizzle-orm';

import { db } from '@/db/db';
import {
  exerciseSets,
  exerciseSetsInsertSchemaType,
  exerciseSetsSelectSchemaType,
} from '@/db/schema';
import { TemporarySet } from '@/stores/selectSets';

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

export const updateSets = async (
  setsByExercise: Record<number, exerciseSetsSelectSchemaType[]>
) => {
  const flatSets = Object.values(setsByExercise).flat();
  if (flatSets.length === 0) return [];

  const ids: number[] = [];
  const repsSqlChunks: SQL[] = [];
  const weightSqlChunks: SQL[] = [];

  repsSqlChunks.push(sql`(case`);
  weightSqlChunks.push(sql`(case`);

  for (const set of flatSets) {
    if (set.reps !== null) {
      repsSqlChunks.push(sql`when ${exerciseSets.id} = ${set.id} then ${set.reps}`);
    }
    if (set.weight !== null) {
      weightSqlChunks.push(sql`when ${exerciseSets.id} = ${set.id} then ${set.weight}`);
    }
    ids.push(set.id);
  }

  repsSqlChunks.push(sql`else ${exerciseSets.reps} end)`);
  weightSqlChunks.push(sql`else ${exerciseSets.weight} end)`);

  const repsFinalSql = sql.join(repsSqlChunks, sql.raw(' '));
  const weightFinalSql = sql.join(weightSqlChunks, sql.raw(' '));

  return await db
    .update(exerciseSets)
    .set({
      reps: repsFinalSql,
      weight: weightFinalSql,
    })
    .where(inArray(exerciseSets.id, ids))
    .returning();
};
export const insertSets = async (pendingSets: Record<number, TemporarySet[]>) => {
  try {
    const insertSets = Object.values(pendingSets)
      .flat()
      .map((set) => ({
        exercisesRoutineId: set.exercisesRoutineId,
        order: set.order,
        reps: set.reps,
        weight: set.weight,
        type: 'default',
      })) as exerciseSetsInsertSchemaType[];

    if (insertSets.length === 0) return [];

    return await db.insert(exerciseSets).values(insertSets).returning();
  } catch (e) {
    console.log(e);
    return [];
  }
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

export const deleteSets = async (ids: number[]) => {
  await db.delete(exerciseSets).where(inArray(exerciseSets.id, ids));
};
