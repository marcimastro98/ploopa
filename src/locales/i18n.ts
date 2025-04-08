import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./en/translation.json";
import it from "./it/translation.json";

i18n.use(initReactI18next).init({
  lng: Localization.locale.split("-")[0], // es: "it" da "it-IT"
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    it: { translation: it },
  },
  interpolation: {
    escapeValue: false, // React fa già escaping
  },
});

export default i18n;
