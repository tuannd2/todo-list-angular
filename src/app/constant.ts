export const DAY = 24 * 60 * 60 * 1000;

export const PRIORITY = {
  LOW: 3,
  MEDIUM: 2,
  HIGH: 1,
} as const satisfies Record<string, number>;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const DELAY_MS = 2000;
