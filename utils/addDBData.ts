import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import AsyncStorage from 'expo-sqlite/kv-store';

import * as schema from '@/db/schema';
import { exercises, routines } from '@/db/schema';

export const addDBData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  const value = AsyncStorage.getItemSync('initialized');
  if (value === 'true') return;

  await db.insert(exercises).values([
    {
      name: 'Sentadilla',
      description:
        'Ejercicio para fortalecer las piernas y glúteos, bajando el cuerpo en posición de cuclillas.',
    },
    {
      name: 'Press de banca',
      description:
        'Ejercicio para el pecho y los tríceps, realizado tumbado mientras empujas una barra o mancuernas hacia arriba.',
    },
    {
      name: 'Peso muerto',
      description:
        'Ejercicio para la parte baja de la espalda, glúteos y piernas, levantando una barra desde el suelo hasta la cintura.',
    },
    {
      name: 'Dominadas',
      description:
        'Ejercicio para la espalda y los bíceps, donde te cuelgas de una barra y levantas el cuerpo hasta que la barbilla supere la barra.',
    },
    {
      name: 'Press militar',
      description:
        'Ejercicio para los hombros, empujando una barra o mancuernas hacia arriba desde la altura del pecho.',
    },
    {
      name: 'Curl de bíceps',
      description:
        'Ejercicio para fortalecer los bíceps, doblando los brazos con una barra o mancuernas.',
    },
    {
      name: 'Extensiones de tríceps',
      description: 'Ejercicio para los tríceps, estirando los brazos con mancuernas o poleas.',
    },
    {
      name: 'Abdominales',
      description:
        'Ejercicio para fortalecer el abdomen, levantando la parte superior del cuerpo mientras estás acostado.',
    },
    {
      name: 'Plancha',
      description:
        'Ejercicio isométrico para el core, manteniendo el cuerpo recto apoyado en los antebrazos y los pies.',
    },
    {
      name: 'Zancadas',
      description:
        'Ejercicio para piernas y glúteos, dando pasos largos mientras bajas el cuerpo hacia el suelo.',
    },
    {
      name: 'Remo con barra',
      description:
        'Ejercicio para la espalda, jalando una barra hacia el abdomen mientras estás inclinado.',
    },
    {
      name: 'Flexiones',
      description:
        'Ejercicio para pecho y tríceps, levantando el cuerpo desde el suelo usando las manos y los pies.',
    },
    {
      name: 'Elevaciones laterales',
      description: 'Ejercicio para los hombros, levantando mancuernas hacia los lados.',
    },
    {
      name: 'Sentadilla búlgara',
      description:
        'Ejercicio unilateral para piernas y glúteos, con una pierna apoyada en un banco y la otra en el suelo.',
    },
    {
      name: 'Press de piernas',
      description:
        'Ejercicio para las piernas, empujando una plataforma con los pies desde una posición sentada.',
    },
    {
      name: 'Encogimientos de hombros',
      description: 'Ejercicio para los trapecios, levantando los hombros mientras sostienes pesas.',
    },
    {
      name: 'Puente de glúteos',
      description:
        'Ejercicio para los glúteos, levantando la cadera mientras estás acostado boca arriba.',
    },
    {
      name: 'Step-ups',
      description:
        'Ejercicio para piernas y glúteos, subiendo y bajando de una plataforma elevada.',
    },
    {
      name: 'Jalón al pecho',
      description:
        'Ejercicio para la espalda, tirando una barra hacia el pecho mientras usas una polea.',
    },
    {
      name: 'Press inclinado',
      description:
        'Ejercicio para el pecho superior, empujando una barra o mancuernas en un banco inclinado.',
    },
  ]);
  await db.insert(routines).values([
    {
      name: 'Rutina 1',
      description: 'Ejercicios para la rutina',
      color: '#FF0000',
    },
  ]);
  AsyncStorage.setItemSync('initialized', 'true');
};
