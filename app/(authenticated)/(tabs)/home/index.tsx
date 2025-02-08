import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

import BottomWorkoutSheetModal from '@/components/BottomSheetModal';
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedWorkoutRoutineId, setSelectedWorkoutRoutineId] = useState<number | undefined>();
  const { data } = useLiveQuery(getWorkoutHistoryService(), []);
  const { weekView } = props;
  const markedDates: MarkedDates = {};
  const [agendaItems, setAgendaItems] = useState<Section[]>([]);

  const handlePresentModalPress = useCallback((id: number) => {
    setSelectedWorkoutRoutineId(id);
    bottomSheetModalRef.current?.present();
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    return (
      <>
        {item.workouts.map((workout: any) => (
          <TouchableOpacity
            onPress={() => handlePresentModalPress(workout.workoutHistoryId)}
            key={workout.workoutHistoryId}>
            <View className="gap-2 rounded-lg border-b border-gray-400 p-3">
              <Text className="text-xl font-bold">{workout.routineName}</Text>
              <View className="flex-row justify-between pr-8">
                <Text>Duración: {formatTime(workout.trainDuration)}</Text>
                <Ionicons name="eye" size={24} color="gray" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  }, []);

  data.forEach((workout) => {
    if (workout.createdAt) {
      markedDates[new Date(workout.createdAt).toISOString().split('T')[0]] = {
        dotColor: '#000',
        marked: true,
      };
    }
  });
  console.log({ markedDates });
  useEffect(() => {
    // Group workouts by day
    const groupedByDayAndExercise = data?.reduce(
      (acc: { [key: string]: { [key: string]: WorkoutHistoryService[] } }, workout) => {
        const day = dayjs(workout.createdAt || new Date()).format('YYYY-MM-DD');
        const routineName = workout.routineName || 'Unknown Exercise';
        if (!acc[day]) {
          acc[day] = {};
        }
        if (!acc[day][routineName]) {
          acc[day][routineName] = [];
        }
        acc[day][routineName].push(workout);
        return acc;
      },
      {}
    );

    // Convert grouped data to sections array
    const listData: Section[] = Object.entries(groupedByDayAndExercise || {})
      .sort(([dayA], [dayB]) => dayjs(dayB).valueOf() - dayjs(dayA).valueOf())
      .map(([day, exercises]) => ({
        title: day,
        data: Object.entries(exercises).map(([exerciseName, workouts]) => ({
          exerciseName,
          workouts,
        })),
      }));
    setAgendaItems(listData);
  }, [data]);

  return (
    <View className="flex-1">
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
        <AgendaList sections={agendaItems} renderItem={renderItem} />
      </CalendarProvider>
      {selectedWorkoutRoutineId && (
        <BottomWorkoutSheetModal
          workoutRoutineId={selectedWorkoutRoutineId}
          ref={bottomSheetModalRef}
        />
      )}
    </View>
  );
};

export default Home;
