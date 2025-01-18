import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import AsyncStorage from 'expo-sqlite/kv-store';

import * as schema from '@/db/schema';
import { categories } from '@/db/schema';
import { insertExerciseWithCategories } from '@/services/exercises';

export const addDBData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  const value = AsyncStorage.getItemSync('initialized');
  if (value === 'true') return;

  await db.insert(categories).values([
    {
      name: 'Abdominales',
    },
    {
      name: 'Abductores',
    },
    {
      name: 'Adductores',
    },
    {
      name: 'Bíceps',
    },
    {
      name: 'Cardio',
    },
    {
      name: 'Cuádriceps',
    },
    {
      name: 'Cuello',
    },
    {
      name: 'Cuerpo Entero',
    },
    {
      name: 'Dorsales',
    },
    {
      name: 'Espalda Baja',
    },
    {
      name: 'Espalda Alta',
    },
    {
      name: 'Gemelos',
    },
    {
      name: 'Glúteos',
    },
    {
      name: 'Hombros',
    },
    {
      name: 'Isquiotibiales',
    },
    {
      name: 'Pecho',
    },
    {
      name: 'Trapecio',
    },
    {
      name: 'Tríceps',
    },
  ]);

  const exercisesWithCategories: schema.InsertExercise[] = [
    {
      name: 'Sentadilla',
      description:
        'Ejercicio para fortalecer las piernas y glúteos, bajando el cuerpo en posición de cuclillas.',
      categoryId: 6,
    },
    {
      name: 'Press de banca',
      description:
        'Ejercicio para el pecho y los tríceps, realizado tumbado mientras empujas una barra o mancuernas hacia arriba.',
      categoryId: 16,
    },
    {
      name: 'Peso muerto',
      description:
        'Ejercicio para la parte baja de la espalda, glúteos y piernas, levantando una barra desde el suelo hasta la cintura.',
      categoryId: 10,
    },
    {
      name: 'Dominadas',
      description:
        'Ejercicio para la espalda y los bíceps, donde te cuelgas de una barra y levantas el cuerpo hasta que la barbilla supere la barra.',
      categoryId: 9,
    },
    {
      name: 'Press militar',
      description:
        'Ejercicio para los hombros, empujando una barra o mancuernas hacia arriba desde la altura del pecho.',
      categoryId: 14,
    },
    {
      name: 'Curl de bíceps',
      description:
        'Ejercicio para fortalecer los bíceps, doblando los brazos con una barra o mancuernas.',
      categoryId: 4,
    },
    {
      name: 'Extensiones de tríceps',
      description: 'Ejercicio para los tríceps, estirando los brazos con mancuernas o poleas.',
      categoryId: 18,
    },
    {
      name: 'Abdominales',
      description:
        'Ejercicio para fortalecer el abdomen, levantando la parte superior del cuerpo mientras estás acostado.',
      categoryId: 1,
    },
    {
      name: 'Plancha',
      description:
        'Ejercicio isométrico para el core, manteniendo el cuerpo recto apoyado en los antebrazos y los pies.',
      categoryId: 1,
    },
    {
      name: 'Zancadas',
      description:
        'Ejercicio para piernas y glúteos, dando pasos largos mientras bajas el cuerpo hacia el suelo.',
      categoryId: 6,
    },
    {
      name: 'Remo con barra',
      description:
        'Ejercicio para la espalda, jalando una barra hacia el abdomen mientras estás inclinado.',
      categoryId: 9,
    },
    {
      name: 'Flexiones',
      description:
        'Ejercicio para pecho y tríceps, levantando el cuerpo desde el suelo usando las manos y los pies.',
      categoryId: 16,
    },
    {
      name: 'Elevaciones laterales',
      description: 'Ejercicio para los hombros, levantando mancuernas hacia los lados.',
      categoryId: 14,
    },
    {
      name: 'Sentadilla búlgara',
      description:
        'Ejercicio unilateral para piernas y glúteos, con una pierna apoyada en un banco y la otra en el suelo.',
      categoryId: 6,
    },
    {
      name: 'Press de piernas',
      description:
        'Ejercicio para las piernas, empujando una plataforma con los pies desde una posición sentada.',
      categoryId: 6,
    },
    {
      name: 'Encogimientos de hombros',
      description: 'Ejercicio para los trapecios, levantando los hombros mientras sostienes pesas.',
      categoryId: 17,
    },
    {
      name: 'Puente de glúteos',
      description:
        'Ejercicio para los glúteos, levantando la cadera mientras estás acostado boca arriba.',
      categoryId: 13,
    },
    {
      name: 'Step-ups',
      description:
        'Ejercicio para piernas y glúteos, subiendo y bajando de una plataforma elevada.',
      categoryId: 6,
    },
    {
      name: 'Jalón al pecho',
      description:
        'Ejercicio para la espalda, tirando una barra hacia el pecho mientras usas una polea.',
      categoryId: 9,
    },
    {
      name: 'Press inclinado',
      description:
        'Ejercicio para el pecho superior, empujando una barra o mancuernas en un banco inclinado.',
      categoryId: 16,
    },
  ];

  for (const exercise of exercisesWithCategories) {
    await insertExerciseWithCategories(exercise);
  }
  AsyncStorage.setItemSync('initialized', 'true');
};
