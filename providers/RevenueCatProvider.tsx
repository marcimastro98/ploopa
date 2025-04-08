import { useEffect } from "react";
import Purchases from "react-native-purchases";

export default function RevenueCatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Purchases.configure({ apiKey: "LA_TUA_API_KEY_REVENUECAT" });
  }, []);

  return <>{children}</>;
}
