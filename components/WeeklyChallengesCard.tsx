import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Title, Subtitle } from "@/components/Typography";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

type ChallengeProps = {
  challengeTitle: string; // es. "7-Day Focus Challenge"
  completedCount: number; // es. 3
  requiredCount: number; // es. 7
};

export default function WeeklyChallengescomponentesContainer({
  challengeTitle,
  completedCount,
  requiredCount,
}: ChallengeProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const progress = Math.min(completedCount / requiredCount, 1);

  return (
    <View
      style={[
        styles.componentesContainer,
        { backgroundColor: colors.background },
      ]}
    >
      <Title style={{ color: colors.text }}>{t("weeklyChallengeTitle")}</Title>
      <Subtitle>{challengeTitle}</Subtitle>

      {/* Barretta di progresso semplice */}
      <View
        style={[styles.progressBar, { backgroundColor: colors.tabIconDefault }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.tint,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.text, marginTop: 8 }}>
          {completedCount} / {requiredCount} {t("sessionsCompleted")}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.challengeButton, { backgroundColor: colors.tint }]}
      >
        <Text style={[styles.challengeButtonText]}>
          {t("viewChallengeDetails")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  componentesContainer: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
  },
  challengeButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  challengeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
