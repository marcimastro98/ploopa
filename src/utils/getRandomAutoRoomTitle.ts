const AUTO_ROOM_TITLES = [
  "🚀 Focus Sprint",
  "🔥 Deep Work Session",
  "🌈 Productivity Boost",
  "🎯 Quick Win Focus",
  "✨ Supercharge Session",
  "🌟 Power Pomodoro",
  "⚡️ Instant Flow",
  "🧠 Mind Zone",
  "💡 Creative Bubble",
  "📚 Study Together",
  "💪 Motivation Room",
  "☕️ Coffee & Focus",
  "🌱 Growth Session",
  "🚴 Sprint Focus",
  "🧘 Zen Work",
];

export const getRandomAutoRoomTitle = (): string => {
  const index = Math.floor(Math.random() * AUTO_ROOM_TITLES.length);
  return AUTO_ROOM_TITLES[index];
};
