'use client';

import { useEffect, useState } from 'react';

export interface ClockState {
  time: string;
  timeZone: string;
  mounted: boolean;
}

const formatTime = (): { time: string; timeZone: string } => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(now);
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  const second = parts.find((p) => p.type === 'second')?.value ?? '00';
  const timeZone = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'UTC';

  return { time: `${hour}:${minute}:${second}`, timeZone };
};

export const useClock = (): ClockState => {
  const [state, setState] = useState<ClockState>({ time: '', timeZone: '', mounted: false });

  useEffect(() => {
    const tick = () => {
      const { time, timeZone } = formatTime();
      setState({ time, timeZone, mounted: true });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
};
