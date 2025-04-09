import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/config/useColorScheme";
import { useClientOnlyValue } from "@/components/config/useClientOnlyValue";
import { useTranslation } from "react-i18next";
import RevenueCatProvider from "@/providers/RevenueCatProvider";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <RevenueCatProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopColor: Colors[colorScheme ?? "light"].tabIconDefault,
          },
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("focus"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="hourglass-start" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            title: t("challenges"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="flag-checkered" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: t("statistics"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="line-chart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="user-circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </RevenueCatProvider>
  );
}
