import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";

export default function LanguageSelector({ showIcon = true, compact = false }) {
  const { language, setLanguage } = useLanguage();
  const current = languages[language] || languages.en;

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={compact ? "w-28 h-9" : "w-36 h-9"}>
        <div className="flex items-center min-w-0">
          {showIcon && <Globe className="w-4 h-4 mr-2 text-gray-500 shrink-0" />}
          <SelectValue>
            <span className="flex items-center gap-1 truncate">
              <span>{current.flag}</span>
              <span className="truncate">{current.nativeName}</span>
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, lang]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-xs text-gray-500">({lang.name})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
