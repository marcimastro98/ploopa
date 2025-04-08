import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { PREMIUM_BENEFITS } from "@/src/types/constants/premiumBenefits"; // importa i benefits

export default function PremiumScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Puoi prendere dinamicamente il prezzo e valuta locale
  const price = "2,99 €";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.title, { color: colors.pomodoroRed }]}>
        {t("goPremium")}
      </Text>

      <View style={styles.benefits}>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.key} style={styles.benefitRow}>
            <Ionicons
              name={benefit.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={colors.tint}
            />
            <Text style={[styles.benefitText, { color: colors.text }]}>
              {t(benefit.key)}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.pomodoroRed }]}
      >
        <Text style={styles.buttonText}>
          {t("upgradeNow")} – {price}/{t("month")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  benefits: {
    gap: 16,
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
