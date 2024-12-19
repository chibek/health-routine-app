import { sql, relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const routines = sqliteTable(
  'routines',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    userId: text('user_id').notNull(),
    color: text('color').notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => []
);

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

export const routineExercises = sqliteTable(
  'routine_exercises',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sets: integer('sets'),
    reps: integer('reps'),
    rest_seconds: integer('duration'),
    weight: integer('weight'),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
    routine_id: integer('routine_id')
      .notNull()
      .references(() => routines.id),
    exercise_id: integer('exercise_id') // Added this field
      .notNull()
      .references(() => exercises.id),
  },
  (t) => []
);

export const exercisesRelations = relations(exercises, ({ many }) => ({
  routineExercises: many(routineExercises),
}));

export const routineExercisesRelations = relations(routineExercises, ({ one }) => ({
  exercise: one(exercises, {
    fields: [routineExercises.exercise_id],
    references: [exercises.id],
  }),
}));
