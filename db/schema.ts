import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const routines = sqliteTable(
  'routines',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

export const routinesSelectSchema = createSelectSchema(routines);
export type routinesSelectSchemaType = z.infer<typeof routinesSelectSchema>;

export const routinesInsertSchema = createInsertSchema(routines, {
  name: z.string().min(1, { message: 'Debes ingresar un nombre de rutina' }),
});
export type routinesInsertSchemaType = z.infer<typeof routinesInsertSchema>;

export const exercises = sqliteTable(
  'exercises',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

export const exercisesSelectSchema = createSelectSchema(exercises);
export type exercisesSelectSchemaType = z.infer<typeof exercisesSelectSchema>;

export const exercisesInsertSchema = createInsertSchema(exercises);
export type exercisesInsertSchemaType = z.infer<typeof exercisesInsertSchema>;

export const exercisesToRoutine = sqliteTable(
  'exercises_routines',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    exercise_id: integer('exercises_id')
      .notNull()
      .references(() => exercises.id),
    routine_id: integer('routine_id')
      .notNull()
      .references(() => routines.id),
  },
  (t) => []
);

export const exercisesToRoutineSelectSchema = createSelectSchema(exercisesToRoutine);
export type exercisesToRoutineSelectSchemaType = z.infer<typeof exercisesToRoutineSelectSchema>;

export const exercisesToRoutineInsertSchema = createInsertSchema(exercisesToRoutine);
export type exercisesToRoutineInsertSchemaType = z.infer<typeof exercisesToRoutineInsertSchema>;

export const exerciseSets = sqliteTable(
  'exercise_sets',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    exercises_routine_id: integer('exercises_routine_id')
      .notNull()
      .references(() => exercisesToRoutine.id),
    type: text('type', { enum: ['default', 'warmup', 'dropset'] }).notNull(),
    reps: integer('reps'),
    weight: integer('weight'),
    rest_seconds: integer('rest_seconds'),
    order: integer('order').notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

export const exerciseSetsSelectSchema = createSelectSchema(exerciseSets);
export type exerciseSetsSelectSchemaType = z.infer<typeof exerciseSetsSelectSchema>;

export const exerciseSetsInsertSchema = createInsertSchema(exerciseSets);
export type exerciseSetsInsertSchemaType = z.infer<typeof exerciseSetsInsertSchema>;
