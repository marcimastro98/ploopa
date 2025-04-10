import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import { mockUsers } from "@/mocks/users";
import { useTranslation } from "react-i18next";

export default function UserCounter() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>
        👥 {t("usersOnline", { count: mockUsers.length })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginBottom: 40,
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});
