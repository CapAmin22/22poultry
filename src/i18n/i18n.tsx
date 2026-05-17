/**
 * i18n — Internationalization Framework
 * 
 * Lightweight i18n solution for 22POULTRY.
 * Supports lazy-loaded language packs for Telugu, Hindi, English.
 * 
 * User Story: US-003 (P0 — Vernacular Voice-First UI)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import en from './locales/en.json';
import te from './locales/te.json';
import hi from './locales/hi.json';

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
];

const locales: Record<SupportedLanguage, Record<string, any>> = { en, te, hi };

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Get nested value from object using dot-notation key
 */
function getNestedValue(obj: Record<string, any>, key: string): string {
  const keys = key.split('.');
  let result: any = obj;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  return typeof result === 'string' ? result : key;
}

/**
 * Detect browser language and match to supported languages
 */
function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  
  // Check localStorage first
  const stored = localStorage.getItem('22poultry-language');
  if (stored && (stored === 'en' || stored === 'te' || stored === 'hi')) {
    return stored as SupportedLanguage;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'te') return 'te';
  if (browserLang === 'hi') return 'hi';
  
  return 'en';
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(detectLanguage());

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('22poultry-language', lang);
    // Set document lang for accessibility
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(locales[language], key);
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
