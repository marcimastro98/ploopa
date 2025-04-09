import { View, StyleSheet } from "react-native";
import { Title, Subtitle } from "@/components/Typography";
import { useColorScheme } from "@/components/config/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Title>{t("statistics")}</Title>
      <Subtitle>{t("statistics_description")}</Subtitle>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
