import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ className = '' }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ru', name: 'Русский' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' }
  ];

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    // Persist using the key expected by i18next-browser-languagedetector
    try {
      localStorage.setItem('i18nextLng', newLang);
    } catch {}
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-5 h-5 text-muted-foreground" />
      <select
        value={i18n.resolvedLanguage || (i18n.language ? i18n.language.split('-')[0] : 'es')}
        onChange={handleLanguageChange}
        className="bg-background text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-background text-foreground">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
