import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

export const expoDB = openDatabaseSync('workouts.db', { enableChangeListener: true });
export const db = drizzle(expoDB);
