const PREFERENCES_KEY = 'preferences';

type Preferences = {
  applyFilters: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  applyFilters: false,
};

export const useLocalStorage = () => {
  const getPreferences = (): Preferences => {
    const preferences = localStorage.getItem(PREFERENCES_KEY);
    return preferences != null ? { ...DEFAULT_PREFERENCES, ...JSON.parse(preferences) } : { ...DEFAULT_PREFERENCES };
  };

  const updatePreferences = (partialPreferences: Partial<Preferences>) => {
    const preferences = getPreferences();
    return localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...preferences, ...partialPreferences }));
  };

  const getItem = (key: string) => {
    return localStorage.getItem(key);
  };

  const setItem = (key: string, value: string) => {
    return localStorage.setItem(key, value);
  };

  return {
    getPreferences,
    updatePreferences,
    getItem,
    setItem,
  };
};
