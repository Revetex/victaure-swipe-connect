import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import enJobs from "./locales/en/jobs.json";
import frCommon from "./locales/fr/common.json";
import frJobs from "./locales/fr/jobs.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        jobs: enJobs,
      },
      fr: {
        common: frCommon,
        jobs: frJobs,
      },
    },
    lng: localStorage.getItem("language") || "fr",
    fallbackLng: "fr",
    ns: ["common", "jobs"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;