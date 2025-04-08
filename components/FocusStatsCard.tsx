import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Title, Subtitle } from "@/components/Typography";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

type Props = {
  sessionCountToday: number;
  dayStreak: number;
  level: number;
};

export default function FocusStatscomponentesContainer({
  sessionCountToday,
  dayStreak,
  level,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.componentesContainer,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.tint }]}>
            {sessionCountToday}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            {t("sessionsToday")}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.tint }]}>
            {dayStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            {t("dayStreak")}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.tint }]}>
            {level}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            {t("level")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  componentesContainer: {
    padding: 5,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    textAlign: "center", // Ensure text is centered
    flexWrap: "wrap", // Allow text to wrap if too long
    width: 80, // Constrain width to ensure proper wrapping
  },
});
