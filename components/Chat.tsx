import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockMessages } from "@/mocks/messages";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

interface ChatProps {
  isPremium: boolean;
  onUpgradePress?: () => void;
}

export default function Chat({ isPremium, onUpgradePress }: ChatProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Send message:", inputValue);
      setInputValue("");
    }
  };

  const renderAvatar = (username: string) => {
    const initials = username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  const generateColorForUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  const messagesList = (
    <FlatList
      data={mockMessages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.messageRow}>
          {renderAvatar(item.username)}
          <View style={styles.bubble}>
            <Text
              style={[
                styles.username,
                { color: generateColorForUsername(item.username) },
              ]}
            >
              @{item.username}
            </Text>
            <Text style={[styles.messageText, { color: colors.text }]}>
              {item.text}
            </Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.messageList}
    />
  );

  if (!isPremium) {
    return (
      <View
        style={[styles.chatContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.blurredContainer}>
          <BlurView
            intensity={20}
            style={StyleSheet.absoluteFill}
            tint={colorScheme === "dark" ? "dark" : "light"}
          />
        </View>
        {messagesList}
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            { backgroundColor: colors.pomodoroRed },
          ]}
          onPress={onUpgradePress}
        >
          <Text style={styles.upgradeButtonText}>{t("upgradeToPremium")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={[styles.chatContainer, { backgroundColor: colors.background }]}
    >
      {messagesList}

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.tint, color: colors.text },
          ]}
          placeholder={t("chat.writePlaceholder")}
          placeholderTextColor={colors.tabIconDefault}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
          <Ionicons name="send" size={22} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    width: "100%",
    flex: 1,
    padding: 12,
    justifyContent: "flex-end",
    position: "relative",
  },
  blurredContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 2,
  },
  messageList: {
    paddingBottom: 12,
    zIndex: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 8,
  },
  avatarText: {
    color: "#000",
    fontWeight: "bold",
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 8,
  },
  username: {
    fontWeight: "600",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  upgradeButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    zIndex: 3,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
