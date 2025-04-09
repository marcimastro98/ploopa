// src/utils/buildReaction.ts
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const buildReaction = (emoji: string) => ({
  id: Date.now(),
  emoji,
  startX: Math.random() * (width - 40),
  rotation: (Math.random() - 0.5) * 20, // -10° a +10°
});
