import dayjs from 'dayjs';
import { eq, gt } from 'drizzle-orm';

import { db } from '@/db/db';
import { routines, workoutHistory, workoutLogsInsertSchemaType } from '@/db/schema';

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
      workoutHistoryId: workoutHistory.id,
      routineName: routines.name,
      createdAt: workoutHistory.createdAt,
      trainDuration: workoutHistory.trainDuration,
    })
    .from(workoutHistory)
    .leftJoin(routines, eq(workoutHistory.routineId, routines.id))
    .where(gt(workoutHistory.createdAt, twoWeeksAgo.toISOString()));
};

export const createWorkoutHistoryService = async ({
  exerciseSetId,
  routineId,
  notes,
  trainDuration = 0,
}: workoutLogsInsertSchemaType) => {
  try {
    await db.insert(workoutHistory).values({
      exerciseSetId,
      routineId,
      notes,
      trainDuration,
    });
  } catch (e) {
    console.log(e);
  }
};
