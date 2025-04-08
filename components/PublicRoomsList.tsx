import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

type Room = {
  id: string;
  name: string;
  currentUsers: number;
  maxUsers: number;
};

type Props = {
  rooms: Room[];
  onJoinRoom?: (roomId: string) => void;
};

export default function PublicRoomsList({ rooms, onJoinRoom }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (rooms.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>{t("noRoomsAvailable")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      >
        {rooms.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.roomCard, { backgroundColor: colors.background }]}
            onPress={() => onJoinRoom?.(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.roomName, { color: colors.text }]}>
              {item.name}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={{ color: colors.tint }}>
                {item.currentUsers} / {item.maxUsers} users
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  carousel: {
    // se vuoi una minHeight:
    // minHeight: 130,
  },
  carouselContent: {},
  roomCard: {
    width: 160,
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    // Ombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Ombra Android
    elevation: 3,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
    marginRight: 6,
  },
});
