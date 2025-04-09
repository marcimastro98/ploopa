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

export default function FocusRoomScreen() {
  const { roomId, isNew } = useLocalSearchParams();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isCountdownRunning, setIsCountdownRunning] = useState(
    isNew === "true"
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [isPremium] = useState(false); // TODO: fetch real user premium status

  const totalSessions = isPremium
    ? PomodoroConfig.totalSessionsPremiumDefault
    : PomodoroConfig.totalSessionsNonPremium;

  const activeDuration = isBreak
    ? PomodoroConfig.breakDuration
    : PomodoroConfig.focusDuration;

  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(activeDuration);

  // Countdown iniziale (Join Room)
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

  // Countdown sessione
  useEffect(() => {
    if (!sessionStarted) return;

    // Reset all’inizio di ogni nuova sessione o pausa
    setSessionSecondsLeft(activeDuration);

    const interval = setInterval(() => {
      setSessionSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
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
        setSessionStarted(false); // fine di tutto il ciclo
      }
    } else {
      setIsBreak(true); // passa alla pausa
    }
  };

  const handleReaction = (reaction: string) => {
    // Opzionale: invio al backend
    console.log("Reaction:", reaction);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Focus Room</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Room ID: <Text style={{ fontWeight: "bold" }}>{roomId}</Text>
      </Text>

      <UserCounter />

      {isCountdownRunning ? (
        <View style={styles.countdownContainer}>
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
          <FocusProgressCircle
            secondsLeft={sessionSecondsLeft}
            totalDuration={activeDuration}
            isBreak={isBreak}
          />

          <Text style={[styles.sessionCount, { color: colors.text }]}>
            {`Session ${currentSession} / ${totalSessions}`}
          </Text>

          {!isBreak && (
            <>
              <LiveReactionsOverlay />
              <ReactionsBar onReact={handleReaction} />
            </>
          )}

          {isBreak && <Chat isPremium={isPremium} />}
        </>
      ) : (
        <Text style={[styles.focusText, { color: colors.tint }]}>
          🎉 All sessions completed!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
