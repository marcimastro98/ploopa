import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Title, Subtitle } from "@/components/Typography";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Purchases from "react-native-purchases";
import PremiumModal from "@/components/PremiumModal";

export default function FocusScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedTab, setSelectedTab] = useState<"join" | "create">("join");
  const router = useRouter();
  const [hydrationReminder, setHydrationReminder] = useState(true);
  const [stretchReminder, setStretchReminder] = useState(true);
  const [roomName, setRoomName] = useState("My Custom Room");
  const [focusTime, setFocusTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");

  const isPremium = false; // mock utente
  const sessionCount = 3; // sessioni fatte oggi
  const maxFreeSessions = 3; // limite free user

  const [showPremiumSheet, setShowPremiumSheet] = useState(false);

  const handleJoinRoom = () => {
    if (!isPremium && sessionCount >= maxFreeSessions) {
      setShowPremiumSheet(true);
      return;
    }
  };

  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;

      if (current!.availablePackages.length > 0) {
        const purchase = await Purchases.purchasePackage(
          current!.availablePackages[0]
        );
        console.log("Purchase successful!", purchase);
      }

      setShowPremiumSheet(false);
    } catch (err) {
      console.warn("Purchase failed:", err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.tabContainer}>
        {(["join", "create"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && {
                backgroundColor: colors.tint,
                borderColor: colors.tint,
              },
            ]}
            onPress={() => {
              if (tab === "create" && !isPremium) {
                setShowPremiumSheet(true);
              } else {
                setSelectedTab(tab);
              }
            }}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab ? "#fff" : colors.text,
                    opacity: tab === "create" && !isPremium ? 0.5 : 1,
                  },
                ]}
              >
                {t(tab === "join" ? "joinRoom" : "createRoom")}
              </Text>
              {tab === "create" && !isPremium && (
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color={colors.tint}
                  style={{ marginLeft: 6, opacity: 0.6 }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
        ]}
      >
        <Title style={{ color: colors.text }}>
          {t(selectedTab === "join" ? "joinRoom" : "createRoom")}
        </Title>
        <Subtitle>
          {t(
            selectedTab === "join"
              ? "joinRoomDescription"
              : "createRoomDescription"
          )}
        </Subtitle>

        {selectedTab === "join" ? (
          <>
            {["reminderHydration", "reminderStretch"].map((key, idx) => (
              <View key={key} style={styles.switchRow}>
                <Ionicons
                  name={idx === 0 ? "water-outline" : "body-outline"}
                  size={24}
                  color={colors.tint}
                />
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  {t(key)}
                </Text>
                <Switch
                  value={idx === 0 ? hydrationReminder : stretchReminder}
                  onValueChange={
                    idx === 0 ? setHydrationReminder : setStretchReminder
                  }
                />
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.focusBlue },
              ]}
              onPress={handleJoinRoom}
            >
              <Text style={styles.buttonText}>{t("joinNow")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {["roomName", "focusDuration", "breakDuration"].map(
              (field, idx) => (
                <View key={field} style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {t(field)}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { borderColor: colors.tint, color: colors.text },
                    ]}
                    value={[roomName, focusTime, breakTime][idx]}
                    onChangeText={
                      [setRoomName, setFocusTime, setBreakTime][idx]
                    }
                    placeholder={t(field)}
                    placeholderTextColor={colors.tabIconDefault}
                    keyboardType={idx === 0 ? "default" : "numeric"}
                  />
                </View>
              )
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.pomodoroRed },
              ]}
            >
              <Text style={styles.buttonText}>{t("startRoom")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {showPremiumSheet && (
        <PremiumModal
          visible={showPremiumSheet}
          onClose={() => setShowPremiumSheet(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  switchLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  primaryButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
