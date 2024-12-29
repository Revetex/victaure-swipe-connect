import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enMarketplace from "./locales/en/marketplace.json";
import enSettings from "./locales/en/settings.json";
import enTodo from "./locales/en/todo.json";
import enMessages from "./locales/en/messages.json";
import enNotifications from "./locales/en/notifications.json";

// French translations
import frCommon from "./locales/fr/common.json";
import frDashboard from "./locales/fr/dashboard.json";
import frMarketplace from "./locales/fr/marketplace.json";
import frSettings from "./locales/fr/settings.json";
import frTodo from "./locales/fr/todo.json";
import frMessages from "./locales/fr/messages.json";
import frNotifications from "./locales/fr/notifications.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        dashboard: enDashboard,
        marketplace: enMarketplace,
        settings: enSettings,
        todo: enTodo,
        messages: enMessages,
        notifications: enNotifications
      },
      fr: {
        common: frCommon,
        dashboard: frDashboard,
        marketplace: frMarketplace,
        settings: frSettings,
        todo: frTodo,
        messages: frMessages,
        notifications: frNotifications
      },
    },
    lng: localStorage.getItem("language") || "fr",
    fallbackLng: "fr",
    ns: ["common", "dashboard", "marketplace", "settings", "todo", "messages", "notifications"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;