import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { ReactionEmitter } from "@/utils/ReactionEmitter";
import { buildReaction } from "@/src/utils/buildReaction";

const { width, height } = Dimensions.get("window");
const EMOJIS = ["💪", "🔥", "🚀", "🧠", "🎯", "💥", "✨", "🙌", "👏"];

interface FloatingReaction {
  id: number;
  emoji: string;
  startX: number;
  rotation: number;
}

const phraseStyles: TextStyle[] = [
  {
    backgroundColor: "#FFDEAD",
    color: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "bold",
    borderRadius: 20,
    fontSize: 16,
  },
  {
    backgroundColor: "#90EE90",
    color: "#003300",
    fontStyle: "italic",
    fontSize: 16,
    padding: 6,
    borderRadius: 16,
  },
  {
    backgroundColor: "#ADD8E6",
    color: "#00008B",
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18,
    textTransform: "uppercase",
  },
  {
    backgroundColor: "#FFF0F5",
    color: "#C71585",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#C71585",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  {
    backgroundColor: "#D3D3D3",
    color: "#000",
    fontSize: 16,
    padding: 6,
    borderRadius: 12,
  },
];

export default function LiveReactionsOverlay() {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  useEffect(() => {
    const listener = (reaction: string) => {
      setReactions((prev) => [...prev, buildReaction(reaction)]);
    };
    ReactionEmitter.on("reaction", listener);
    return () => {
      ReactionEmitter.off("reaction", listener);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const newReaction: FloatingReaction = {
        id,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        startX: Math.random() * (width - 40),
        rotation: (Math.random() - 0.5) * 20,
      };
      setReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return reactions.map(({ id, emoji, startX, rotation }) => (
    <FloatingEmoji key={id} emoji={emoji} startX={startX} rotation={rotation} />
  ));
}

function FloatingEmoji({
  emoji,
  startX,
  rotation,
}: {
  emoji: string;
  startX: number;
  rotation: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-height * 0.75, { duration: 2200 });
    opacity.value = withDelay(1200, withTiming(0, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotation}deg` }],
    opacity: opacity.value,
    position: "absolute",
    top: height - 150,
    left: startX,
  }));

  const isEmoji = /^[\p{Emoji}]+$/u.test(emoji);

  const randomPhraseStyle: TextStyle = !isEmoji
    ? phraseStyles[Math.floor(Math.random() * phraseStyles.length)]
    : styles.emoji;

  const textStyles: TextStyle[] = [randomPhraseStyle, animatedStyle];

  return <Animated.Text style={textStyles}>{emoji}</Animated.Text>;
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 36,
    zIndex: 999,
  },
});
