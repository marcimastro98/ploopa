import { Text, TextProps, StyleSheet } from "react-native";
import { useColorScheme } from "@/components/config/useColorScheme";
import { Colors } from "@/constants/Colors";

function useThemeColor() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
}

export function Title(props: TextProps) {
  const theme = useThemeColor();
  return (
    <Text
      {...props}
      style={[styles.title, { color: theme.pomodoroRed }, props.style]}
    />
  );
}

export function Subtitle(props: TextProps) {
  const theme = useThemeColor();
  return (
    <Text
      {...props}
      style={[styles.subtitle, { color: theme.text }, props.style]}
    />
  );
}

export function Body(props: TextProps) {
  const theme = useThemeColor();
  return (
    <Text
      {...props}
      style={[styles.body, { color: theme.text }, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontFamily: "Poppins",
    fontSize: 18,
    opacity: 0.8,
  },
  body: {
    fontFamily: "Poppins",
    fontSize: 16,
  },
});
