import dayjs from 'dayjs';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React, { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

import { useSpanishLocale } from '@/hooks/useSpanishCalendar';
import { getWorkoutHistoryService } from '@/services/workout-history';
import { COLORS } from '@/theme/colors';

const ITEMS: any[] = [];

interface Props {
  weekView?: boolean;
}

// @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
ExpandableCalendar.defaultProps = undefined;

const Home = (props: Props) => {
  useSpanishLocale();
  const { data } = useLiveQuery(getWorkoutHistoryService(), []);
  console.log({ data });
  const { weekView } = props;
  const markedDates: MarkedDates = {};
  // const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  const renderItem = useCallback(({ item }: any) => {
    return <Text>{JSON.stringify(item)}</Text>;
  }, []);

  return (
    <CalendarProvider
      date={dayjs().toISOString()}
      // onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={{
        todayButtonTextColor: COLORS.light.primary,
      }}

      // todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar firstDay={1} markedDates={markedDates} />
      ) : (
        <ExpandableCalendar
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header}
          // disableAllTouchEventsForDisabledDays
          closeOnDayPress
          firstDay={1}
          markedDates={markedDates}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
        // dayFormat={'yyyy-MM-d'}
      />
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
