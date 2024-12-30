import { ZodError } from 'zod';

import { db } from '@/db/db';
import {
  exerciseSets,
  exerciseSetsInsertSchema,
  exerciseSetsInsertSchemaType,
  exercisesInsertSchemaType,
  exercisesToRoutine,
  exercisesToRoutineInsertSchema,
  routines,
  routinesInsertSchemaType,
} from '@/db/schema';

export const getRoutines = () => {
  return db.select().from(routines);
};

type AddRoutineType = {
  insertRoutine: routinesInsertSchemaType;
  insertExercises: exercisesInsertSchemaType[];
  insertSets: exerciseSetsInsertSchemaType[];
};

type Response = {
  success: boolean;
};

export const insertRoutine = async ({
  insertRoutine,
  insertExercises,
  insertSets,
}: AddRoutineType): Promise<Response> => {
  await db.transaction(async (tx) => {
    const routineInserted = await tx
      .insert(routines)
      .values([insertRoutine])
      .returning({ routineId: routines.id });

    for (const exercise of insertExercises) {
      const exerciseParsed = exercisesToRoutineInsertSchema.parse({
        exercise_id: exercise.id,
        routine_id: routineInserted[0].routineId,
      });

      const exercisesToRoutineInserted = await tx
        .insert(exercisesToRoutine)
        .values(exerciseParsed)
        .returning({ exercisesToRoutineId: exercisesToRoutine.id });

      for (const set of insertSets) {
        const setParsed = exerciseSetsInsertSchema.parse({
          ...set,
          exercises_routine_id: exercisesToRoutineInserted[0].exercisesToRoutineId,
        });

        await tx.insert(exerciseSets).values(setParsed).returning({ setId: exerciseSets.id });
      }
    }
  });
  return { success: true };
};
