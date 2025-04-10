// export const PomodoroConfig = {
//   focusDuration: 25 * 60, // 25 minuti
//   breakDuration: 5 * 60, // 5 minuti

//   totalSessionsNonPremium: 4,
//   totalSessionsPremiumDefault: 4, // valore default premium

//   wellnessReminders: {
//     stretchEverySessions: 2, // reminder per stretching ogni 2 sessioni
//     drinkWaterEveryMinutes: 45, // reminder per bere ogni 45 minuti
//     breatheEverySessions: 1, // reminder per respirare ogni sessione
//   },
// };

// Only for test
export const PomodoroConfig = {
  focusDuration: 2 * 60, // 2 minuti per test
  breakDuration: 1 * 60, // 1 minuto
  totalSessionsNonPremium: 2,
  totalSessionsPremiumDefault: 2,
  wellnessReminders: {
    stretchEverySessions: 1, // test: ogni sessione
    drinkWaterEveryMinutes: 1, // test: ogni 1 minuto
    breatheEverySessions: 1, // test: ogni pausa
  },
};
