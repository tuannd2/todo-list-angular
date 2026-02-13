export const priority = {
  LOW: 3,
  MEDIUM: 2,
  HIGH: 1,
} as const satisfies Record<string, number>;

export type Priority = (typeof priority)[keyof typeof priority];
