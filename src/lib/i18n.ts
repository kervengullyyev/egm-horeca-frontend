"use client";

import i18next, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "@/lib/languages";

const resources: Resource = {
  en: { translation: translations.en as Record<string, string> },
  ro: { translation: translations.ro as Record<string, string> },
};

// Initialize i18next only once in the browser
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    defaultNS: "translation",
  });
}

export default i18next;


