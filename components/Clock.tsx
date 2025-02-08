import { memo, useEffect } from 'react';
import { NativeModules, Text } from 'react-native';

import { useClockStore } from '@/stores/clock';
import { formatTime } from '@/utils/utils';

interface ClockProps {
  id: string;
  enableActivityLife?: boolean;
  className?: string;
}

const { TimerWidgetModule } = NativeModules;

const Clock = memo(({ id, className, enableActivityLife = false }: ClockProps) => {
  const clock = useClockStore((state) => state.clocks[id]);
  const addClock = useClockStore((state) => state.addClock);
  const updateElapsedTime = useClockStore((state) => state.updateElapsedTime);

  useEffect(() => {
    if (!clock) {
      addClock(id);
    }
  }, [clock, id, addClock]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (clock?.isRunning) {
      timerInterval = setInterval(() => {
        const elapsed = Date.now() - clock.startTime;
        updateElapsedTime(id, elapsed);
      }, 100);
      if (enableActivityLife && TimerWidgetModule) {
        TimerWidgetModule.startLiveActivity(clock.startTime / 1000);
      }
    }

    return () => clearInterval(timerInterval);
  }, [clock?.isRunning, clock?.startTime, id, updateElapsedTime]);

  if (!clock) return null;

  return <Text className={className}>{formatTime(clock.elapsedTime)}</Text>;
});

Clock.displayName = 'Clock';

export default Clock;
