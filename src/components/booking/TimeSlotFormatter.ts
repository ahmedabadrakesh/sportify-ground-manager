
/**
 * Formats a time string (HH:MM) into a readable format (hh:mm AM/PM)
 */
export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  
  if (hourNum === 0) {
    return "12:00 AM";
  } else if (hourNum < 12) {
    return `${hourNum}:${minute} AM`;
  } else if (hourNum === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hourNum - 12}:${minute} PM`;
  }
};
