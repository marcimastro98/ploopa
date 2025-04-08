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
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import Purchases from "react-native-purchases";
import PremiumModal from "@/components/PremiumModal";
import FocusStatsCard from "@/components/FocusStatsCard";
import WeeklyChallengesCard from "@/components/WeeklyChallengesCard";
import PublicRoomsList from "@/components/PublicRoomsList";
import JoinCreateSession from "@/components/JoinCreateSession";

import type { ReminderSetting } from "@/types/reminder";
import { MAX_FREE_SESSIONS_PER_DAY } from "@/types/constants/subscription";
import type { FocusTab } from "@/types/focus";

export default function FocusScreen() {
  // Stati esistenti
  const [selectedTab, setSelectedTab] = useState<FocusTab>("join");
  const [hydrationReminder, setHydrationReminder] = useState(true);
  const [stretchReminder, setStretchReminder] = useState(true);
  const [roomName, setRoomName] = useState("My Custom Room");
  const [focusTime, setFocusTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");
  const isPremium = false; // mock
  const sessionCount = 3; // mock
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);

  // Nuovi stati mock (per le stats)
  const dayStreak = 5; // es. 5 giorni consecutivi
  const level = 2; // es. livello 2

  // Mock challenge data
  const challengeTitle = "7-Day Focus Challenge";
  const challengeCompleted = 3;
  const challengeRequired = 7;

  // Mock public rooms
  const publicRooms = [
    { id: "1", name: "Focus with Devs", currentUsers: 3, maxUsers: 10 },
    { id: "2", name: "Morning Hustle", currentUsers: 8, maxUsers: 10 },
    { id: "3", name: "Focus with Devs", currentUsers: 3, maxUsers: 10 },
    { id: "4", name: "Morning Hustle", currentUsers: 8, maxUsers: 10 },
    { id: "5", name: "Focus with Devs", currentUsers: 3, maxUsers: 10 },
    { id: "6", name: "Morning Hustle", currentUsers: 8, maxUsers: 10 },
  ];

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

  // Handler per un join stanza pubblica
  const handleJoinPublicRoom = (roomId: string) => {
    console.log("Joining public room: ", roomId);
    // Esempio: router.push(`/rooms/${roomId}`) oppure la tua logica
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { flex: 1 }]}>
        {/* CARD STATS */}
        <View>
          <FocusStatsCard
            sessionCountToday={sessionCount}
            dayStreak={dayStreak}
            level={level}
          />
        </View>
        {/* CARD PUBLIC ROOMS */}
        <View>
          <PublicRoomsList
            rooms={publicRooms}
            onJoinRoom={handleJoinPublicRoom}
          />
        </View>

        {/* CARD "JOIN / CREATE" */}
        <View>
          <JoinCreateSession
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isPremium={isPremium}
            showPremiumSheet={showPremiumSheet}
            setShowPremiumSheet={setShowPremiumSheet}
            reminderSettings={reminderSettings}
            handleJoinRoom={handleJoinRoom}
            roomName={roomName}
            setRoomName={setRoomName}
            focusTime={focusTime}
            setFocusTime={setFocusTime}
            breakTime={breakTime}
            setBreakTime={setBreakTime}
          />
        </View>

        {/* CARD CHALLENGE */}
        <View>
          <WeeklyChallengesCard
            challengeTitle={challengeTitle}
            completedCount={challengeCompleted}
            requiredCount={challengeRequired}
          />
        </View>

        {/* MODALE PREMIUM */}
        {showPremiumSheet && (
          <PremiumModal
            visible={showPremiumSheet}
            onClose={() => setShowPremiumSheet(false)}
            onUpgrade={handleUpgrade}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10, // Added margin to the left and right
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
