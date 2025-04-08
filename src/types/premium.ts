export enum PremiumBenefitKey {
  UnlimitedSessions = "premiumUnlimitedSessions",
  CreateRooms = "premiumCreateRooms",
  SocialMoments = "premiumSocialMoments",
  DetailedStats = "premiumDetailedStats",
}

export type PremiumBenefit = {
  key: PremiumBenefitKey;
  icon: string; // Ionicon name
};
