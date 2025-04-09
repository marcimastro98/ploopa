import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";

interface Props {
  secondsLeft: number;
  isBreak: boolean;
}

export default function FocusTimerDisplay({ secondsLeft, isBreak }: Props) {
  const colors = Colors[useColorScheme() ?? "light"];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.tint }]}>
        {isBreak ? "Break" : "Focus"}
      </Text>
      <Text style={[styles.time, { color: colors.text }]}>
        {formatTime(secondsLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 24,
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 4,
  },
  time: {
    fontSize: 56,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
});
