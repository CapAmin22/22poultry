
import React from 'react';
import { Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n, SUPPORTED_LANGUAGES } from '@/i18n/i18n';
import { motion } from 'framer-motion';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 text-sm h-8 px-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang?.nativeName || 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between cursor-pointer ${
              language === lang.code ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{lang.nativeName}</span>
              <span className="text-xs text-gray-400">{lang.name}</span>
            </div>
            {language === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-blue-500"
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
