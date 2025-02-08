import dayjs from 'dayjs';
import { eq, gt } from 'drizzle-orm';

import { db } from '@/db/db';
import { routines, workoutRoutines, workoutSets } from '@/db/schema';

export type WorkoutHistoryService = {
  workoutHistoryId: number;
  routineName: string | null;
  trainDuration: number | null;
  createdAt: string | null;
};

export const getWorkoutHistoryService = () => {
  const today = dayjs();
  const twoWeeksAgo = today.subtract(14, 'day');

  return db
    .select({
      workoutHistoryId: workoutRoutines.id,
      routineName: routines.name,
      createdAt: workoutRoutines.createdAt,
      trainDuration: workoutRoutines.trainDuration,
    })
    .from(workoutRoutines)
    .leftJoin(routines, eq(workoutRoutines.routineId, routines.id))
    .where(gt(workoutRoutines.createdAt, twoWeeksAgo.toISOString()));
};

export const getWorkoutHistorySetsByRoutineId = (workoutRoutineId: number) => {
  return db.query.workoutSets.findMany({
    with: {
      exerciseSet: {
        columns: { reps: true, weight: true },
        with: {
          exerciseRoutine: {
            with: {
              exercise: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: eq(workoutSets.workoutRoutineId, workoutRoutineId),
  });
};

export const insertWorkoutSetHistory = async ({
  workoutRoutineId,
  exerciseSetId,
}: {
  workoutRoutineId: number;
  exerciseSetId: number;
}) => {
  try {
    await db.insert(workoutSets).values({
      workoutRoutineId,
      exerciseSetId,
    });
  } catch (e) {
    console.log(e);
  }
};

export const insertWorkoutRoutineHistory = async ({
  routineId,
  trainDuration = 0,
}: {
  routineId: number;
  trainDuration: number;
}) => {
  try {
    const [insertedRoutine] = await db
      .insert(workoutRoutines)
      .values({
        routineId,
        trainDuration,
      })
      .returning();
    return insertedRoutine;
  } catch (e) {
    console.log(e);
  }
};
