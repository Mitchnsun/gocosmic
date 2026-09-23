export type AvailabilityStatus = 'available' | 'booked';

export interface Availability {
  /** `available`: the studio takes new projects. `booked`: the calendar is full until `startMonth`. */
  status: AvailabilityStatus;
  /** First month a new project can start, as ISO `YYYY-MM`. */
  startMonth: string;
}

/**
 * Availability announced in the status bar on every page.
 * Update it whenever the schedule changes; the month name is localised automatically.
 */
export const AVAILABILITY: Availability = {
  status: 'available',
  startMonth: '2026-10',
};
