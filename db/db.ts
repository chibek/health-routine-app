import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const expoDB = openDatabaseSync('workouts.db', {
  enableChangeListener: true,
  useNewConnection: true,
});
expoDB.execAsync('PRAGMA foreign_keys = ON');
export const db = drizzle(expoDB, {
  schema,
});
