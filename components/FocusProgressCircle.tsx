import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.6;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  secondsLeft: number;
  totalDuration: number;
  isBreak: boolean;
}

export default function FocusProgressCircle({
  secondsLeft,
  totalDuration,
  isBreak,
}: Props) {
  const progress = useSharedValue(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    progress.value = withTiming(secondsLeft / totalDuration, { duration: 250 });
  }, [secondsLeft]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.wrapper}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          stroke={colors.tabIconDefault}
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          stroke={isBreak ? colors.pomodoroRed : colors.tint}
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={[styles.timerText, { color: colors.text }]}>
        {formatTime(secondsLeft)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },
  timerText: {
    position: "absolute",
    fontSize: 40,
    fontWeight: "bold",
  },
});
