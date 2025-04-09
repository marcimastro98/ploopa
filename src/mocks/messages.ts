export type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
};

export const mockMessages: ChatMessage[] = [
  {
    id: "msg1",
    userId: "1",
    username: "Alice",
    text: "Ciao ragazzi!",
    timestamp: Date.now() - 60000,
  },
  {
    id: "msg2",
    userId: "2",
    username: "Bob",
    text: "Pronti per la sessione?",
    timestamp: Date.now() - 30000,
  },
];
