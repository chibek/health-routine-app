import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
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
    image: text('description'),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
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
  (t) => []
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  routineExercises: many(exercisesToRoutine),
  categories: many(exerciseCategories),
}));

export const exerciseCategoriesRelations = relations(exerciseCategories, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseCategories.exerciseId],
    references: [exercises.id],
  }),
  category: one(categories, {
    fields: [exerciseCategories.categoryId],
    references: [categories.id],
  }),
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

export const workoutRoutines = sqliteTable(
  'workout_routines',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    routineId: integer('routine_id')
      .notNull()
      .references(() => routines.id, { onDelete: 'cascade' }),
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

export const workoutSets = sqliteTable(
  'workout_sets',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    workoutRoutineId: integer('workout_routine_id')
      .notNull()
      .references(() => workoutRoutines.id, { onDelete: 'cascade' }),
    exerciseSetId: integer('exercise_set_id')
      .notNull()
      .references(() => exerciseSets.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

// Relations
export const workoutRoutinesRelations = relations(workoutRoutines, ({ one, many }) => ({
  routine: one(routines, {
    fields: [workoutRoutines.routineId],
    references: [routines.id],
  }),
  sets: many(workoutSets),
}));

// Relations for workout sets
export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  workoutRoutine: one(workoutRoutines, {
    fields: [workoutSets.workoutRoutineId],
    references: [workoutRoutines.id],
  }),
  exerciseSet: one(exerciseSets, {
    fields: [workoutSets.exerciseSetId],
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

export const workoutRoutinesSelectSchema = createSelectSchema(workoutRoutines);
export type WorkoutRoutinesSelectSchema = z.infer<typeof workoutRoutinesSelectSchema>;

export const workoutRoutinesInsertSchema = createInsertSchema(workoutRoutines);
export type WorkoutRoutinesInsertSchema = z.infer<typeof workoutRoutinesInsertSchema>;

export const workoutSetsSelectSchema = createSelectSchema(workoutSets);
export type WorkoutSetsSelectSchema = z.infer<typeof workoutSetsSelectSchema>;

export const workoutSetsInsertSchema = createInsertSchema(workoutSets);
export type WorkoutSetsInsertSchema = z.infer<typeof workoutSetsInsertSchema>;

export const categoriesInsertSchema = createInsertSchema(categories);
export type categoriesInsertSchemaType = z.infer<typeof categoriesInsertSchema>;

export const categoriesSelectSchema = createSelectSchema(categories);
export type categoriesSelectSchemaType = z.infer<typeof categoriesSelectSchema>;

export type InsertExercise = exercisesInsertSchemaType & {
  categoryId?: number;
};
