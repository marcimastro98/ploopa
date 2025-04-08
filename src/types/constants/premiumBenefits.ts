import { PremiumBenefit, PremiumBenefitKey } from "@/types/premium";

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  { key: PremiumBenefitKey.UnlimitedSessions, icon: "infinite-outline" },
  { key: PremiumBenefitKey.CreateRooms, icon: "people-outline" },
  { key: PremiumBenefitKey.SocialMoments, icon: "chatbubbles-outline" },
  { key: PremiumBenefitKey.DetailedStats, icon: "stats-chart-outline" },
];
