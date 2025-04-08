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
import type { ReminderSetting } from "@/types/reminder";
import { MAX_FREE_SESSIONS_PER_DAY } from "@/types/constants/subscription";
import type { FocusTab } from "@/types/focus";

export default function FocusScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<FocusTab>("join");
  const [hydrationReminder, setHydrationReminder] = useState(true);
  const [stretchReminder, setStretchReminder] = useState(true);
  const [roomName, setRoomName] = useState("My Custom Room");
  const [focusTime, setFocusTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");

  const isPremium = false; // mock
  const sessionCount = 3; // mock

  const [showPremiumSheet, setShowPremiumSheet] = useState(false);

  const reminderSettings: ReminderSetting[] = [
    {
      key: "reminderHydration",
      icon: "water-outline",
      state: hydrationReminder,
      setState: setHydrationReminder,
    },
    {
      key: "reminderStretch",
      icon: "body-outline",
      state: stretchReminder,
      setState: setStretchReminder,
    },
  ];

  const handleJoinRoom = () => {
    if (!isPremium && sessionCount >= MAX_FREE_SESSIONS_PER_DAY) {
      setShowPremiumSheet(true);
      return;
    }
    // altrimenti join logica
  };

  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;

      if (current?.availablePackages.length) {
        const purchase = await Purchases.purchasePackage(
          current.availablePackages[0]
        );
        console.log("Purchase successful!", purchase);
        setShowPremiumSheet(false);
      }
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
      {/* TABS */}
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

      {/* CARD */}
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
            {reminderSettings.map(({ key, icon, state, setState }) => (
              <View key={key} style={styles.switchRow}>
                <Ionicons name={icon} size={24} color={colors.tint} />
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  {t(key)}
                </Text>
                <Switch value={state} onValueChange={setState} />
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
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("roomName")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.tint, color: colors.text },
                ]}
                value={roomName}
                onChangeText={setRoomName}
                placeholder={t("roomName")}
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("focusDuration")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.tint, color: colors.text },
                ]}
                value={focusTime}
                onChangeText={setFocusTime}
                placeholder={t("focusDuration")}
                keyboardType="numeric"
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t("breakDuration")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.tint, color: colors.text },
                ]}
                value={breakTime}
                onChangeText={setBreakTime}
                placeholder={t("breakDuration")}
                keyboardType="numeric"
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>

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

      {/* MODALE PREMIUM */}
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
