import { useEffect, useState } from "react";
import { PomodoroConfig } from "@/src/types/constants/PomodoroConfig";
import { Audio } from "expo-av";

export type ReminderType = "hydration" | "stretch" | "breathe";

interface UseWellnessRemindersParams {
  hydrationReminder: boolean;
  stretchReminder: boolean;
  breathReminder: boolean;
  currentSession: number;
  isBreak: boolean;
  activeDuration: number;
  sessionSecondsLeft: number;
  debug?: boolean;
}

export function useWellnessReminders({
  hydrationReminder,
  stretchReminder,
  breathReminder,
  currentSession,
  isBreak,
  activeDuration,
  sessionSecondsLeft,
  debug = false,
}: UseWellnessRemindersParams) {
  const [showReminder, setShowReminder] = useState<ReminderType | null>(null);
  const [lastReminderTimestamps, setLastReminderTimestamps] = useState<
    Partial<Record<ReminderType, number>>
  >({});

  const triggerReminder = async (type: ReminderType) => {
    const now = Date.now();
    if (
      lastReminderTimestamps[type] &&
      now - lastReminderTimestamps[type]! < 60000
    ) {
      return;
    }

    debug && console.log(`[Reminder Triggered]: ${type}`);

    setShowReminder(type);
    setLastReminderTimestamps((prev) => ({ ...prev, [type]: now }));

    const soundMap = {
      hydration: require("@/assets/sounds/hydration.mp3"),
      stretch: require("@/assets/sounds/stretch.mp3"),
      breathe: require("@/assets/sounds/breathe.mp3"),
    };

    const { sound } = await Audio.Sound.createAsync(soundMap[type]);
    await sound.playAsync();

    setTimeout(() => {
      setShowReminder(null);
    }, 8000);
  };

  useEffect(() => {
    const now = Date.now();
    const elapsedMinutes = (activeDuration - sessionSecondsLeft) / 60;

    // 💧 Hydration reminder (during focus)
    if (
      hydrationReminder &&
      !isBreak &&
      elapsedMinutes > 0 &&
      elapsedMinutes %
        PomodoroConfig.wellnessReminders.drinkWaterEveryMinutes ===
        0 &&
      (!lastReminderTimestamps.hydration ||
        now - lastReminderTimestamps.hydration > 60000)
    ) {
      triggerReminder("hydration");
    }

    // 💪 Stretch reminder (at start of certain sessions)
    if (
      stretchReminder &&
      !isBreak &&
      currentSession % PomodoroConfig.wellnessReminders.stretchEverySessions ===
        0 &&
      sessionSecondsLeft === activeDuration
    ) {
      triggerReminder("stretch");
    }

    // 🧘‍♂️ Breathe reminder (at start of certain breaks)
    if (
      breathReminder &&
      isBreak &&
      currentSession % PomodoroConfig.wellnessReminders.breatheEverySessions ===
        0 &&
      sessionSecondsLeft === PomodoroConfig.breakDuration
    ) {
      triggerReminder("breathe");
    }
  }, [sessionSecondsLeft]);

  return { showReminder };
}
