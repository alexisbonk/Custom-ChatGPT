import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export const useTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const startTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      setTimerRunning(false);
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    if (timerIntervalRef.current) stopTimer();
    startTimeRef.current = new Date();
    timerIntervalRef.current = setInterval(() => {
      const now = new Date();
      const timeElapsed = now - startTimeRef.current;
      setElapsedTime(timeElapsed);
    }, 10);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return useMemo(() => ({
    centiseconds: Math.floor((elapsedTime % 1000) / 10),
    milliseconds: elapsedTime % 1000,
    seconds: Math.floor(elapsedTime / 1000) % 60,
    minutes: Math.floor(elapsedTime / 60000),
    startTimer,
    stopTimer,
    timerRunning,
  }), [elapsedTime, startTimer, stopTimer, timerRunning]);
};

export default useTimer;
