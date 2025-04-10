import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import ReactionsBar from "@/components/ReactionsBar";
import UserCounter from "@/components/UserCounter";
import Chat from "@/components/Chat";
import FocusProgressCircle from "@/components/FocusProgressCircle";
import LiveReactionsOverlay from "@/components/LiveReactionsOverlay";
import { PomodoroConfig } from "@/src/types/constants/PomodoroConfig";
import FocusTimerDisplay from "@/components/FocusTimerDisplay";
import Purchases from "react-native-purchases";
import PremiumModal from "@/components/PremiumModal";
import {
  ReminderType,
  useWellnessReminders,
} from "@/src/utils/reminders/UseWellnessRemindersParams";
import ReminderBanner from "@/components/ReminderBanner";

export default function FocusRoomScreen() {
  const { roomId, isNew, hydration, stretch, breath } = useLocalSearchParams();
  const hydrationReminder = hydration === "true";
  const stretchReminder = stretch === "true";
  const breathReminder = breath === "true";
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [secondsLeft, setSecondsLeft] = useState(1);
  const [isCountdownRunning, setIsCountdownRunning] = useState(
    isNew === "true"
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [isPremium] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const totalSessions = isPremium
    ? PomodoroConfig.totalSessionsPremiumDefault
    : PomodoroConfig.totalSessionsNonPremium;

  const activeDuration = isBreak
    ? PomodoroConfig.breakDuration
    : PomodoroConfig.focusDuration;

  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(activeDuration);

  const [reminderToShow, setReminderToShow] = useState<ReminderType | null>(
    null
  );

  const { showReminder } = useWellnessReminders({
    hydrationReminder,
    stretchReminder,
    breathReminder,
    currentSession,
    isBreak,
    activeDuration,
    sessionSecondsLeft,
    debug: true,
  });

  useEffect(() => {
    if (showReminder) {
      setReminderToShow(showReminder);
    }
  }, [showReminder]);

  useEffect(() => {
    if (isCountdownRunning) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCountdownRunning(false);
            setSessionStarted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCountdownRunning]);

  useEffect(() => {
    if (!sessionStarted) return;
    setSessionSecondsLeft(activeDuration);

    const interval = setInterval(() => {
      setSessionSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          handleSessionEnd();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStarted, isBreak, currentSession]);

  const handleSessionEnd = () => {
    if (isBreak) {
      if (currentSession < totalSessions) {
        setCurrentSession((s) => s + 1);
        setIsBreak(false);
      } else {
        setSessionStarted(false);
      }
    } else {
      setIsBreak(true);
    }
  };

  const handleReaction = (reaction: string) => {
    console.log("Reaction:", reaction);
  };

  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current?.availablePackages.length) {
        const purchase = await Purchases.purchasePackage(
          current.availablePackages[0]
        );
        console.log("Purchase successful!", purchase);
        setShowPremiumModal(false);
      }
    } catch (err) {
      console.warn("Purchase failed:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {reminderToShow && (
        <ReminderBanner
          type={reminderToShow}
          label={t(`reminder.${reminderToShow}`)}
          onHide={() => setReminderToShow(null)}
        />
      )}

      <UserCounter />
      {isCountdownRunning ? (
        <View style={styles.countdownContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("focusRoomTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("focusRoomId")}:{" "}
            <Text style={{ fontWeight: "bold" }}>{roomId}</Text>
          </Text>
          <Text style={[styles.countdownText, { color: colors.tint }]}>
            {t("focus.room.sessionStartsIn", { seconds: secondsLeft })}
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.tint}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : sessionStarted ? (
        <>
          <FocusTimerDisplay isBreak={isBreak} />
          <FocusProgressCircle
            secondsLeft={sessionSecondsLeft}
            totalDuration={activeDuration}
            isBreak={isBreak}
          />

          <Text style={[styles.sessionCount, { color: colors.text }]}>
            {t("focusRoomSession", {
              current: currentSession,
              total: totalSessions,
            })}
          </Text>

          {!isBreak && (
            <>
              <LiveReactionsOverlay />
              <ReactionsBar onReact={handleReaction} />
            </>
          )}

          {isBreak && (
            <>
              <Chat
                isPremium={isPremium}
                onUpgradePress={() => setShowPremiumModal(true)}
              />
              {showPremiumModal && (
                <PremiumModal
                  visible={showPremiumModal}
                  onClose={() => setShowPremiumModal(false)}
                  onUpgrade={handleUpgrade}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Text style={[styles.focusText, { color: colors.tint }]}>
          {t("focusRoomCompleted")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    height: "100%",
    alignItems: "center",
    padding: 24,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  countdownContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 20,
    fontWeight: "600",
  },
  focusText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  sessionCount: {
    fontSize: 18,
    marginTop: 12,
  },
});
