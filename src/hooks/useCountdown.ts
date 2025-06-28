import React, { useState, useEffect } from "react";
import { getTimeRemaining } from "../utils";

export const useCountdown = (candleTimestamp: string) => {
  const targetTime = new Date(candleTimestamp).getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetTime);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return {
    timeLeft,
  };
};
