import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: localStorage.getItem("language") || "fr",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;