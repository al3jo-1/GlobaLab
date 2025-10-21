import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // console.error('Error setting localStorage item:', error);
    }
  }, [key, storedValue]);


  const saveValue = useCallback(() => {
     try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // console.error('Error saving localStorage item:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, saveValue];
};