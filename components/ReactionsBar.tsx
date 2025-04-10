import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { emojiReactions, textReactions } from "@/mocks/reactions";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import { ReactionEmitter } from "@/utils/ReactionEmitter";

interface ReactionsBarProps {
  onReact: (reaction: string) => void;
}

export default function ReactionsBar({ onReact }: ReactionsBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleReact = (reaction: string) => {
    onReact(reaction);
    ReactionEmitter.emit("reaction", reaction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.reactionRow}>
        {emojiReactions.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.reactionButton,
              { backgroundColor: colors.background },
            ]}
            onPress={() => handleReact(emoji)}
          >
            <Text style={styles.reactionText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.textRow}>
        {textReactions.map((phrase) => (
          <TouchableOpacity
            key={phrase}
            style={[styles.textButton, { borderColor: colors.tint }]}
            onPress={() => handleReact(phrase)}
          >
            <Text style={[styles.textReaction, { color: colors.tint }]}>
              {phrase}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "center",
    width: "100%",
  },
  reactionRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  reactionButton: {
    padding: 10,
    borderRadius: 12,
  },
  reactionText: {
    fontSize: 24,
  },
  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  textButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  textReaction: {
    fontSize: 14,
    fontWeight: "500",
  },
});
