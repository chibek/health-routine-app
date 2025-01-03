import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';
import { Text } from 'react-native';

const Clock = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    setIsRunning(true);

    if (isRunning && startTime) {
      timerInterval = setInterval(() => {
        const now = dayjs();
        setElapsedTime(now.diff(startTime)); // Calculate elapsed time
      }, 100);
    }

    return () => clearInterval(timerInterval); // Cleanup interval on stop or unmount
  }, [isRunning, startTime]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return <Text>{formatTime(elapsedTime)}</Text>;
});

// Add display name for debugging purposes
Clock.displayName = 'Clock';

export default Clock;
