import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
import enAuth from "./locales/en/auth.json";
import enNavigation from "./locales/en/navigation.json";
import enHero from "./locales/en/hero.json";
import enFeatures from "./locales/en/features.json";
import enDashboard from "./locales/en/dashboard.json";
import enMarketplace from "./locales/en/marketplace.json";
import enSettings from "./locales/en/settings.json";
import enMessages from "./locales/en/messages.json";
import enNotifications from "./locales/en/notifications.json";
import enTodo from "./locales/en/todo.json";
import enNotes from "./locales/en/notes.json";

// French translations
import frAuth from "./locales/fr/auth.json";
import frNavigation from "./locales/fr/navigation.json";
import frHero from "./locales/fr/hero.json";
import frFeatures from "./locales/fr/features.json";
import frDashboard from "./locales/fr/dashboard.json";
import frMarketplace from "./locales/fr/marketplace.json";
import frSettings from "./locales/fr/settings.json";
import frMessages from "./locales/fr/messages.json";
import frNotifications from "./locales/fr/notifications.json";
import frTodo from "./locales/fr/todo.json";
import frNotes from "./locales/fr/notes.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      auth: enAuth,
      navigation: enNavigation,
      hero: enHero,
      features: enFeatures,
      dashboard: enDashboard,
      marketplace: enMarketplace,
      settings: enSettings,
      messages: enMessages,
      notifications: enNotifications,
      todo: enTodo,
      notes: enNotes,
    },
    fr: {
      auth: frAuth,
      navigation: frNavigation,
      hero: frHero,
      features: frFeatures,
      dashboard: frDashboard,
      marketplace: frMarketplace,
      settings: frSettings,
      messages: frMessages,
      notifications: frNotifications,
      todo: frTodo,
      notes: frNotes,
    },
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