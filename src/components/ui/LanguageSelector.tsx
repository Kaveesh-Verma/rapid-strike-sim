import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportedLanguage } from "@/lib/i18n/translations";

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <Select value={language} onValueChange={(value) => onLanguageChange(value as SupportedLanguage)}>
      <SelectTrigger className="w-[140px] bg-black/50 border-cyber-green/30 text-gray-200 font-mono text-sm">
        <Globe className="w-4 h-4 mr-2 text-cyber-green" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-black border-cyber-green/30">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="font-mono text-gray-200 hover:text-cyber-green focus:text-cyber-green focus:bg-cyber-green/10"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
