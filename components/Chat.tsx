import React from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { mockMessages } from "@/mocks/messages";
import { useColorScheme } from "@/components/config/useColorScheme";
import { Colors } from "@/constants/Colors";

interface ChatProps {
  isPremium: boolean;
}

export default function Chat({ isPremium }: ChatProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.message, { color: colors.text }]}>
            <Text style={styles.username}>{item.username}: </Text>
            {item.text}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      {isPremium ? (
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.tint,
            },
          ]}
          placeholder="Write a message..."
          placeholderTextColor={colors.tabIconDefault}
        />
      ) : (
        <View style={[styles.lockedOverlay]}>
          <Text style={[styles.lockedText, { color: colors.tint }]}>
            🔒 Premium only
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: 180,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
  },
  message: {
    fontSize: 14,
    marginBottom: 6,
  },
  username: {
    fontWeight: "bold",
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
  lockedOverlay: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
  },
  lockedText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
