import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Routines table
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

export const routinesRelations = relations(routines, ({ many }) => ({
  exercises: many(exercisesToRoutine),
}));

// Exercises table
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

export const categories = sqliteTable(
  'categories',
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

export const exerciseCategories = sqliteTable(
  'exercise_categories',
  {
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.exerciseId, t.categoryId] }),
  })
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  routineExercises: many(exercisesToRoutine),
  categories: many(categories),
}));

// Junction table between routines and exercises
export const exercisesToRoutine = sqliteTable(
  'exercises_routines',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    routineId: integer('routine_id')
      .notNull()
      .references(() => routines.id, { onDelete: 'cascade' }),
  },
  (t) => []
);

export const exercisesToRoutineRelations = relations(exercisesToRoutine, ({ one, many }) => ({
  routine: one(routines, {
    fields: [exercisesToRoutine.routineId],
    references: [routines.id],
  }),
  exercise: one(exercises, {
    fields: [exercisesToRoutine.exerciseId],
    references: [exercises.id],
  }),
  sets: many(exerciseSets),
}));

// Exercise sets table
export const exerciseSets = sqliteTable(
  'exercise_sets',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    exercisesRoutineId: integer('exercises_routine_id')
      .notNull()
      .references(() => exercisesToRoutine.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['default', 'warmup', 'dropset'] }).notNull(),
    reps: integer('reps'),
    weight: integer('weight'),
    restSeconds: integer('rest_seconds'),
    order: integer('order').notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

export const exerciseSetsRelations = relations(exerciseSets, ({ one }) => ({
  exerciseRoutine: one(exercisesToRoutine, {
    fields: [exerciseSets.exercisesRoutineId],
    references: [exercisesToRoutine.id],
  }),
}));

export const workoutHistory = sqliteTable(
  'workout_history',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    routineId: integer('routine_id')
      .notNull()
      .references(() => routines.id, { onDelete: 'cascade' }),
    exerciseSetId: integer('exercise_set_id')
      .notNull()
      .references(() => exerciseSets.id, { onDelete: 'cascade' }),
    trainDuration: integer('train_duration'),
    notes: text('notes'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

// Relations
export const workoutHistoryRelations = relations(workoutHistory, ({ one }) => ({
  routine: one(routines, {
    fields: [workoutHistory.routineId],
    references: [routines.id],
  }),
  exerciseSet: one(exerciseSets, {
    fields: [workoutHistory.exerciseSetId],
    references: [exerciseSets.id],
  }),
}));

// Schemas
export const routinesSelectSchema = createSelectSchema(routines);
export type routinesSelectSchemaType = z.infer<typeof routinesSelectSchema>;

export const routinesInsertSchema = createInsertSchema(routines);
export type routinesInsertSchemaType = z.infer<typeof routinesInsertSchema>;

export const exercisesSelectSchema = createSelectSchema(exercises);
export type exercisesSelectSchemaType = z.infer<typeof exercisesSelectSchema>;

export const exercisesInsertSchema = createInsertSchema(exercises);
export type exercisesInsertSchemaType = z.infer<typeof exercisesInsertSchema>;

export const exercisesToRoutineSelectSchema = createSelectSchema(exercisesToRoutine);
export type exercisesToRoutineSelectSchemaType = z.infer<typeof exercisesToRoutineSelectSchema>;

export const exercisesToRoutineInsertSchema = createInsertSchema(exercisesToRoutine);
export type exercisesToRoutineInsertSchemaType = z.infer<typeof exercisesToRoutineInsertSchema>;

export const exerciseSetsSelectSchema = createSelectSchema(exerciseSets);
export type exerciseSetsSelectSchemaType = z.infer<typeof exerciseSetsSelectSchema>;
export type TypeEnum = exerciseSetsSelectSchemaType['type'];

export const exerciseSetsInsertSchema = createInsertSchema(exerciseSets);
export type exerciseSetsInsertSchemaType = z.infer<typeof exerciseSetsInsertSchema>;
export const workoutLogsSelectSchema = createSelectSchema(workoutHistory);
export type workoutLogsSelectSchemaType = z.infer<typeof workoutLogsSelectSchema>;

export const workoutLogsInsertSchema = createInsertSchema(workoutHistory);
export type workoutLogsInsertSchemaType = z.infer<typeof workoutLogsInsertSchema>;
