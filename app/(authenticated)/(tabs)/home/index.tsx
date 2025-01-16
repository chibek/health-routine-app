import dayjs from 'dayjs';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

import { useSpanishLocale } from '@/hooks/useSpanishCalendar';
import { getWorkoutHistoryService, WorkoutHistoryService } from '@/services/workout-history';
import { COLORS } from '@/theme/colors';
import { formatTime } from '@/utils/utils';

interface Section {
  title: string;
  data: {
    exerciseName: string;
    workouts: WorkoutHistoryService[];
  }[];
}

interface Props {
  weekView?: boolean;
}

// @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
ExpandableCalendar.defaultProps = undefined;

const Home = (props: Props) => {
  useSpanishLocale();
  const { data } = useLiveQuery(getWorkoutHistoryService(), []);
  const { weekView } = props;
  const markedDates: MarkedDates = {};
  const [agendaItems, setAgendaItems] = useState<Section[]>([]);

  const renderItem = useCallback(({ item }: any) => {
    return (
      <View className="flex items-start gap-2 p-2">
        <Text className="font-bold">{item.exerciseName}</Text>
        <View className="flex items-center gap-1">
          <Text>Tiempo:</Text>
          <Text>{formatTime(item.workouts[0].trainDuration)}</Text>
        </View>
      </View>
    );
  }, []);

  data
    .map((workout) => {
      if (workout.createdAt) {
        markedDates[new Date(workout.createdAt).toISOString().split('T')[0]] = {
          dotColor: '#00FF00',
        };
      }
    })
    .filter(Boolean);

  useEffect(() => {
    // Group workouts by day
    const groupedByDayAndExercise = data?.reduce(
      (acc: { [key: string]: { [key: string]: WorkoutHistoryService[] } }, workout) => {
        const day = dayjs(workout.createdAt || new Date()).format('DD-MM-YYYY');
        const exercise = workout.routineName || 'Unknown Exercise';

        if (!acc[day]) {
          acc[day] = {};
        }
        if (!acc[day][exercise]) {
          acc[day][exercise] = [];
        }
        acc[day][exercise].push(workout);
        return acc;
      },
      {}
    );

    // Convert grouped data to sections array
    const listData: Section[] = Object.entries(groupedByDayAndExercise || {}).map(
      ([day, exercises]) => ({
        title: day,
        data: Object.entries(exercises).map(([exerciseName, workouts]) => ({
          exerciseName,
          workouts,
        })),
      })
    );
    setAgendaItems(listData);
  }, [data]);

  return (
    <CalendarProvider
      date={dayjs().format('YYYY-MM-DD')}
      showTodayButton
      theme={{
        todayButtonTextColor: COLORS.light.primary,
      }}>
      {weekView ? (
        <WeekCalendar current={dayjs().toISOString()} firstDay={1} markedDates={markedDates} />
      ) : (
        <ExpandableCalendar
          theme={{
            selectedDayTextColor: COLORS.dark.grey6,
            selectedDayBackgroundColor: COLORS.light.primary,
          }}
          closeOnDayPress
          firstDay={1}
          markedDates={markedDates}
        />
      )}
      <AgendaList sections={agendaItems} renderItem={renderItem} sectionStyle={styles.section} />
    </CalendarProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: 'lightgrey',
  },
  section: {
    backgroundColor: '#fff',
    color: 'grey',
    textTransform: 'capitalize',
  },
});
