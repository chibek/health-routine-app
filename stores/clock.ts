import { NativeModules } from 'react-native';

import { create } from '@/stores/generic';

interface ClockState {
  clocks: Record<
    string,
    {
      startTime: number;
      elapsedTime: number;
      isRunning: boolean;
    }
  >;
  addClock: (id: string) => void;
  startClock: (id: string) => void;
  stopClock: (id: string) => void;
  resetClock: (id: string) => void;
  updateElapsedTime: (id: string, elapsedTime: number) => void;
}

const { TimerWidgetModule } = NativeModules;

export const useClockStore = create<ClockState>()((set) => ({
  clocks: {},
  addClock: (id) =>
    set((state) => ({
      clocks: {
        ...state.clocks,
        [id]: {
          startTime: Date.now(),
          elapsedTime: 0,
          isRunning: true,
        },
      },
    })),
  startClock: (id) =>
    set((state) => ({
      clocks: {
        ...state.clocks,
        [id]: {
          ...state.clocks[id],
          startTime: Date.now() - (state.clocks[id]?.elapsedTime || 0),
          isRunning: true,
        },
      },
    })),
  stopClock: (id) =>
    set((state) => ({
      clocks: {
        ...state.clocks,
        [id]: {
          ...state.clocks[id],
          isRunning: false,
        },
      },
    })),
  resetClock: (id) => {
    if (id === 'set_time') {
      TimerWidgetModule.reset();
    }
    set((state) => ({
      clocks: {
        ...state.clocks,
        [id]: {
          startTime: Date.now(),
          elapsedTime: 0,
          isRunning: true,
        },
      },
    }));
  },
  updateElapsedTime: (id, elapsedTime) =>
    set((state) => ({
      clocks: {
        ...state.clocks,
        [id]: {
          ...state.clocks[id],
          elapsedTime,
        },
      },
    })),
}));
