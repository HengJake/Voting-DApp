// voting-DApp/src/component/CountdownTimer.jsx
import { useEffect, useState } from "react";

function formatTime(seconds) {
  if (seconds <= 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export default function CountdownTimer({ endTime }) {
  // Fallback: if endTime is not a valid number, show "Invalid"
  const validEndTime = Number(endTime);
  if (!validEndTime || isNaN(validEndTime)) return <span>Invalid</span>;

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, validEndTime - Math.floor(Date.now() / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, validEndTime - Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [validEndTime]);

  return <span>{formatTime(timeLeft)}</span>;
}