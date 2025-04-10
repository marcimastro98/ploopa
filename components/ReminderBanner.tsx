import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

interface ReminderBannerProps {
  type: "hydration" | "stretch" | "breathe";
  label: string;
  onHide: () => void;
  durationMs?: number;
}

export default function ReminderBanner({
  type,
  label,
  onHide,
  durationMs = 7000,
}: ReminderBannerProps) {
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, durationMs);

    return () => clearTimeout(timeout);
  }, []);

  const backgroundColors: Record<ReminderBannerProps["type"], string> = {
    hydration: "#2D9CDB",
    stretch: "#FF8C42",
    breathe: "#00B894",
  };

  const emojis: Record<ReminderBannerProps["type"], string> = {
    hydration: "💧",
    stretch: "🧘‍♂️",
    breathe: "🌬️",
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.emojiWrapperLeft}>
        <Text style={styles.emoji}>{emojis[type]}</Text>
      </View>

      <Animated.View
        style={[
          styles.banner,
          {
            backgroundColor: backgroundColors[type],
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Animated.View>

      <View style={styles.emojiWrapperRight}>
        <Text style={styles.emoji}>{emojis[type]}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  banner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    maxWidth: "70%",
  },
  label: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  emojiWrapperLeft: {
    marginRight: 10,
  },
  emojiWrapperRight: {
    marginLeft: 10,
  },
  emoji: {
    fontSize: 30,
  },
});
