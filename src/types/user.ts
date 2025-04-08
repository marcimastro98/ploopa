export type UserStats = {
  totalFocusMinutes: number;
  totalSessions: number;
  streak: number;
  lastSessionAt: number;
  hasPremium: boolean;
};
export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  stats: UserStats;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
};
