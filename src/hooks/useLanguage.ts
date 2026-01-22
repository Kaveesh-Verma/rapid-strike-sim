import { useState, useEffect, useCallback } from 'react';
import { 
  SupportedLanguage, 
  TranslationStrings, 
  getTranslations, 
  getStoredLanguage, 
  setStoredLanguage 
} from '@/lib/i18n/translations';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getStoredLanguage());
  const [translations, setTranslations] = useState<TranslationStrings>(getTranslations(language));

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setStoredLanguage(lang);
    setLanguageState(lang);
    setTranslations(getTranslations(lang));
  }, []);

  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  return {
    language,
    setLanguage,
    t: translations,
  };
};
