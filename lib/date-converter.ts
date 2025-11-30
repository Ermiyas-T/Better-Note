// Convert dates to user-friendly relative time format with time (e.g., "2h ago", "yesterday 14:30", "Mar 15 14:30")

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function convertDate(date: string | Date): string {
  const actualDate = new Date(date);
  const now = new Date();
  const timeDiff = now.getTime() - actualDate.getTime();

  // Convert to seconds
  const seconds = Math.floor(timeDiff / 1000);
  const timeString = formatTime(actualDate);

  // Less than 1 minute
  if (seconds < 60) {
    return `Just now (${timeString})`;
  }

  // Less than 1 hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago (${timeString})`;
  }

  // Less than 24 hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago (${timeString})`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    actualDate.getDate() === yesterday.getDate() &&
    actualDate.getMonth() === yesterday.getMonth() &&
    actualDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday, ${timeString}`;
  }

  // This week (last 7 days)
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${actualDate.toLocaleDateString("en-US", {
      weekday: "long",
    })}, ${timeString}`;
  }

  // This year
  if (actualDate.getFullYear() === now.getFullYear()) {
    return `${actualDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} ${timeString}`;
  }

  // Older than current year
  return `${actualDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} ${timeString}`;
}
