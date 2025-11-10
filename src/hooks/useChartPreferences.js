import { useState, useEffect } from 'react';

const defaultPreferences = {
  upColor: '#22c55e',
  downColor: '#ef4444',
  wickUpColor: '#22c55e',
  wickDownColor: '#ef4444',
  borderUpColor: '#22c55e',
  borderDownColor: '#ef4444',
};

export const useChartPreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem('chartPreferences');
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chartPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving chart preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreferences,
    resetToDefaults,
    defaultPreferences,
  };
};
