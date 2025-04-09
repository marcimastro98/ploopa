export type User = {
  id: string;
  username: string;
  isPremium: boolean;
};

export const mockUsers: User[] = [
  { id: "1", username: "Alice", isPremium: true },
  { id: "2", username: "Bob", isPremium: false },
  { id: "3", username: "Charlie", isPremium: false },
];
