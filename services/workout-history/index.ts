import dayjs from 'dayjs';
import { eq, gt } from 'drizzle-orm';

import { db } from '@/db/db';
import {
  exercises,
  exerciseSets,
  exercisesToRoutine,
  routines,
  workoutHistory,
  workoutLogsInsertSchemaType,
} from '@/db/schema';

export const getWorkoutHistoryService = () => {
  const today = dayjs();
  const twoWeeksAgo = today.subtract(14, 'day');

  return db
    .select({
      workoutHistoryId: workoutHistory.id,
      routineName: routines.name,
      exerciseName: exercises.name,
      reps: exerciseSets.reps,
      weight: exerciseSets.weight,
    })
    .from(workoutHistory)
    .leftJoin(routines, eq(workoutHistory.routineId, routines.id))
    .leftJoin(exerciseSets, eq(workoutHistory.exerciseSetId, exerciseSets.id))
    .leftJoin(exercisesToRoutine, eq(exerciseSets.exercisesRoutineId, exercisesToRoutine.id))
    .leftJoin(exercises, eq(exercisesToRoutine.exerciseId, exercises.id))
    .where(gt(workoutHistory.createdAt, twoWeeksAgo.toISOString()));
};

export const createWorkoutHistoryService = async ({
  exerciseSetId,
  routineId,
  notes,
}: workoutLogsInsertSchemaType) => {
  try {
    await db.insert(workoutHistory).values({
      exerciseSetId,
      routineId,
      notes,
    });
  } catch (e) {
    console.log(e);
  }
};
