export type ReminderKey =
  | "reminderHydration"
  | "reminderStretch"
  | "reminderBreath";

export type ReminderSetting = {
  key: ReminderKey;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  state: boolean;
  setState: (value: boolean) => void;
};
