import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

export const useDrizzleDb = () => {
  // Get SQLite context
  const db = useSQLiteContext();

  // Memoize drizzle instance to prevent unnecessary recreations
  return useMemo(() => drizzle(db), [db]);
};
