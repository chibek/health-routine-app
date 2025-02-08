import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import {
  exerciseSets,
  exerciseSetsInsertSchema,
  exercisesSelectSchemaType,
  exercisesToRoutine,
  exercisesToRoutineInsertSchema,
  routines,
  routinesInsertSchemaType,
} from '@/db/schema';
import { StoreSet } from '@/stores/sets';

export const getRoutines = () => {
  return db.select().from(routines);
};

export const deleteRoutine = async (id: number) => {
  return await db.delete(routines).where(eq(routines.id, id));
};

type AddRoutineType = {
  insertRoutine: routinesInsertSchemaType;
  insertExercises: exercisesSelectSchemaType[];
  insertSets: StoreSet[];
};

type Response = {
  success: boolean;
};

export const insertRoutine = async ({
  insertRoutine,
  insertExercises,
  insertSets,
}: AddRoutineType): Promise<Response> => {
  try {
    console.log({ insertSets });
    await db.transaction(async (tx) => {
      const routineInserted = await tx
        .insert(routines)
        .values([insertRoutine])
        .returning({ routineId: routines.id });

      for (const exercise of insertExercises) {
        const exerciseParsed = exercisesToRoutineInsertSchema.parse({
          exerciseId: exercise.id,
          routineId: routineInserted[0].routineId,
        });

        const exercisesToRoutineInserted = await tx
          .insert(exercisesToRoutine)
          .values(exerciseParsed)
          .returning({ exercisesToRoutineId: exercisesToRoutine.id });
        for (const set of insertSets) {
          if (set.exerciseId === exercise.id) {
            const setParsed = exerciseSetsInsertSchema.parse({
              ...set,
              exercisesRoutineId: exercisesToRoutineInserted[0].exercisesToRoutineId,
            });
            await tx.insert(exerciseSets).values(setParsed).returning({ setId: exerciseSets.id });
          }
        }
      }
    });
    return { success: true };
  } catch (e) {
    console.log('ERROR: ', e);
    return { success: false };
  }
};
