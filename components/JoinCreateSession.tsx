import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Title, Subtitle } from "@/components/Typography";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";

interface JoinCreateSessionProps {
  selectedTab: "join" | "create";
  setSelectedTab: (tab: "join" | "create") => void;
  isPremium: boolean;
  showPremiumSheet: boolean;
  setShowPremiumSheet: (show: boolean) => void;
  reminderSettings: {
    key: string;
    icon: keyof typeof Ionicons.glyphMap;
    state: boolean;
    setState: (value: boolean) => void;
  }[];
  handleJoinRoom: () => void;
  roomName: string;
  setRoomName: (name: string) => void;
  focusTime: string;
  setFocusTime: (time: string) => void;
  breakTime: string;
  setBreakTime: (time: string) => void;
}

export default function JoinCreateSession({
  selectedTab,
  setSelectedTab,
  isPremium,
  showPremiumSheet,
  setShowPremiumSheet,
  reminderSettings,
  handleJoinRoom,
  roomName,
  setRoomName,
  focusTime,
  setFocusTime,
  breakTime,
  setBreakTime,
}: JoinCreateSessionProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          padding: 16,
        },
      ]}
    >
      {/* TABS "JOIN / CREATE" */}
      <View style={styles.tabContainer}>
        {(["join", "create"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                borderColor:
                  selectedTab === tab ? colors.tint : colors.contrast,
              },
              selectedTab === tab && {
                backgroundColor: colors.tint,
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
          {/* Add a button to display the room name and allow clearing the selection */}
          {selectedTab === "join" && roomName !== "Random" && (
            <View style={styles.roomNameContainer}>
              <TouchableOpacity onPress={() => setRoomName("Random")}>
                <Ionicons name="close" size={24} color={colors.pomodoroRed} />
              </TouchableOpacity>
              <Text style={[styles.roomNameText, { color: colors.text }]}>
                {roomName}
              </Text>
            </View>
          )}
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

          <View style={styles.inputGroupTime}>
            <View>
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

            <View>
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
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
  inputGroupTime: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  roomNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 16,
    display: "flex",
    gap: 8,
  },
  roomNameText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
});
