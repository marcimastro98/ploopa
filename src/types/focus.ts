export type FocusTab = "join" | "create";

export type FocusSession = {
  id: string;
  roomId: string | null;
  userId: string;
  startTime: number; // timestamp
  endTime: number;
  duration: number; // in ms
  type: "focus" | "break";
  createdAt: number;
};

export type RoomCreationForm = {
  roomName: string;
  focusTime: string;
  breakTime: string;
};
