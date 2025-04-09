import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import { mockUsers } from "@/mocks/users";

export default function UserCounter() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>
        👥 {mockUsers.length} users online
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});
