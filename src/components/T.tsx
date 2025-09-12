"use client";

import { useTranslation } from "react-i18next";

export default function T({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}


