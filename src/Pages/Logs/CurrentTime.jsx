import React, { useEffect, useState, useCallback } from "react";

function formatTime(date) {
  const pad = n => n.toString().padStart(2, '0');
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const day = pad(date.getDate());
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${pad(hours)}:${minutes} ${ampm}, ${day}-${month}-${year}`;
}

const CurrentTime = () => {
  const [now, setNow] = useState(new Date());

  const updateTime = useCallback(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateTime, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [updateTime]);

  return <span>{formatTime(now)}</span>;
};

export default CurrentTime;
