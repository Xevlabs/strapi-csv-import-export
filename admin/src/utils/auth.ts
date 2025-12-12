const STORAGE_KEYS = {
  TOKEN: 'jwtToken',
} as const;

const parseStoredToken = (value: string | null): string | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=');
    if (key?.trim() === name) {
      return decodeURIComponent(rest.join('=').trim());
    }
  }
  return null;
};

export const getAdminToken = (): string | null => {
  const fromLocalStorage = parseStoredToken(
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null,
  );
  if (fromLocalStorage) {
    return fromLocalStorage;
  }

  const fromSessionStorage = parseStoredToken(
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.TOKEN) : null,
  );
  if (fromSessionStorage) {
    return fromSessionStorage;
  }

  return getCookieValue(STORAGE_KEYS.TOKEN);
};

export const getAuthHeader = (): Record<string, string> => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

