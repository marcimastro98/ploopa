import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import { useTranslation } from "react-i18next";

interface Props {
  isBreak: boolean;
}

export default function FocusTimerDisplay({ isBreak }: Props) {
  const colors = Colors[useColorScheme() ?? "light"];
  const { t } = useTranslation();
  const label = isBreak ? t("breakTimeLabel") : t("focusTimeLabel");

  return (
    <View style={styles.container}>
      <MaskedView maskElement={<Text style={styles.label}>{label}</Text>}>
        <LinearGradient
          colors={
            isBreak
              ? ["#FF6F91", "#FF9671", "#FFC75F"]
              : ["#00C9A7", "#00A0E3", "#845EC2"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.label, { opacity: 0 }]}>{label}</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  label: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
