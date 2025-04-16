
/**
 * Formats a time string (HH:MM) into a readable format (hh:mm AM/PM)
 */
export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  
  if (hourNum === 0) {
    return `12:${minute} AM`;
  } else if (hourNum < 12) {
    return `${hourNum}:${minute} AM`;
  } else if (hourNum === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hourNum - 12}:${minute} PM`;
  }
};

/**
 * Formats a time slot range into a readable string
 */
export const formatTimeSlot = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Gets a short time display (e.g., "2 PM")
 */
export const formatTimeShort = (time: string): string => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  
  if (hourNum === 0) {
    return "12 AM";
  } else if (hourNum < 12) {
    return `${hourNum} AM`;
  } else if (hourNum === 12) {
    return "12 PM";
  } else {
    return `${hourNum - 12} PM`;
  }
};
