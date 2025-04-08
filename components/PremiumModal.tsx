import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Purchases from "react-native-purchases";

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
};

export default function PremiumModal({ visible, onClose, onUpgrade }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useSharedValue(500);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 150,
      });
    } else {
      translateY.value = withTiming(500, { duration: 200 }, (finished) => {
        if (finished) runOnJS(setInternalVisible)(false);
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const benefits = [
    { key: "premiumUnlimitedSessions", icon: "infinite-outline" },
    { key: "premiumCreateRooms", icon: "people-outline" },
    { key: "premiumSocialMoments", icon: "chatbubbles-outline" },
    { key: "premiumDetailedStats", icon: "stats-chart-outline" },
  ];

  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current && current.availablePackages.length > 0) {
        await Purchases.purchasePackage(current.availablePackages[0]);
        onUpgrade();
      }
    } catch (err) {
      console.error("Errore durante l'acquisto:", err);
    }
  };

  if (!internalVisible) return null;

  return (
    <Modal
      animationType="none"
      transparent
      visible={internalVisible}
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={colorScheme === "dark" ? "dark" : "light"}
          blurAmount={8}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.3)"
        />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.modalBackground },
            animatedStyle,
          ]}
        >
          <Text style={[styles.title, { color: colors.pomodoroRed }]}>
            {t("goPremium")}
          </Text>

          <View style={styles.benefits}>
            {benefits.map((benefit) => (
              <View key={benefit.key} style={styles.benefitRow}>
                <Ionicons
                  name={benefit.icon as any}
                  size={22}
                  color={colors.tint}
                />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  {t(benefit.key)}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.pomodoroRed }]}
            onPress={handleUpgrade}
          >
            <Text style={styles.buttonText}>
              {t("upgradeNow")} – 2,99 €/ {t("month")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: colors.tint }}>{t("close")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  benefits: {
    gap: 12,
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
