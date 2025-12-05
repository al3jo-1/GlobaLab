import { useState, useCallback, useRef } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const latestValueRef = useRef(null);
  
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      latestValueRef.current = parsed;
      return parsed;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      latestValueRef.current = initialValue;
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(prevValue => {
      try {
        const currentValue = latestValueRef.current !== null ? latestValueRef.current : prevValue;
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        
        if (Array.isArray(currentValue) && Array.isArray(valueToStore)) {
          if (valueToStore.length < currentValue.length) {
            console.warn(`useLocalStorage: Array length decreased from ${currentValue.length} to ${valueToStore.length} for key "${key}"`);
          }
        }
        
        latestValueRef.current = valueToStore;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return prevValue;
      }
    });
  }, [key]);

  const saveValue = useCallback((valueToSave) => {
    try {
      const value = valueToSave !== undefined ? valueToSave : latestValueRef.current;
      if (value !== null) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, saveValue];
};