"use client";

import { useTranslation } from "react-i18next";
import React from "react";

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function TranslatedText({ 
  translationKey, 
  fallback, 
  className = "",
  as: Component = "span"
}: TranslatedTextProps) {
  const { t } = useTranslation();
  
  return (
    <Component className={className}>
      {t(translationKey) || fallback}
    </Component>
  );
}
