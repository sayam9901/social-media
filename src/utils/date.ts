/**
 * Date utility functions for Social Media Post Scheduler
 * Handles UTC storage, local timezone display, Day grouping (Today, Tomorrow, Date)
 */

export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function getTimeZoneOffsetString(): string {
  const date = new Date();
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset) / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  return `GMT${sign}${hours}:${minutes}`;
}

/**
 * Returns formatted local time string, e.g. "03:45 PM"
 */
export function formatLocalTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Returns full formatted local date and time string
 */
export function formatLocalDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Categorize a date into "Today", "Tomorrow", or formatted date string (e.g., "Wednesday, Oct 28, 2026")
 * Uses user's local date boundaries.
 */
export function getDayGroupKey(isoString: string): { key: string; label: string; order: number; isPast: boolean } {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return { key: 'invalid', label: 'Invalid Date', order: 999999999, isPast: false };
    }

    const now = new Date();
    // Compare dates using local midnight
    const localTargetMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const localTodayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const diffDays = Math.round((localTargetMidnight - localTodayMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { key: 'today', label: 'Today', order: 0, isPast: false };
    } else if (diffDays === 1) {
      return { key: 'tomorrow', label: 'Tomorrow', order: 1, isPast: false };
    } else if (diffDays === -1) {
      return { key: 'yesterday', label: 'Yesterday', order: -1, isPast: true };
    } else if (diffDays < -1) {
      const formatted = date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return { key: `past-${localTargetMidnight}`, label: formatted, order: diffDays, isPast: true };
    } else {
      const formatted = date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return { key: `future-${localTargetMidnight}`, label: formatted, order: diffDays, isPast: false };
    }
  } catch {
    return { key: 'unknown', label: 'Unknown Date', order: 999999999, isPast: false };
  }
}

/**
 * Checks if an ISO date string is in the future compared to now
 */
export function isFutureDate(isoString: string): boolean {
  try {
    const date = new Date(isoString);
    return date.getTime() > Date.now();
  } catch {
    return false;
  }
}

/**
 * Formats a Date object or milliseconds for <input type="datetime-local" /> in local time
 */
export function toDatetimeLocalInputString(date: Date = new Date()): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a datetime-local input string into ISO UTC string
 */
export function localInputToUtcIso(localDatetimeString: string): string {
  const date = new Date(localDatetimeString);
  return date.toISOString();
}

/**
 * Get quick preset future ISO string
 */
export function getPresetFutureDate(minutesFromNow: number): string {
  const date = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return date.toISOString();
}
