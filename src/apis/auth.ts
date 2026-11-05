// Shared helpers for the auth state persisted in localStorage by AuthProvider/useAuth.
const AUTH_KEY = "auth";

export const getStoredToken = (): string | undefined => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { token?: string } | null;
    return parsed?.token || undefined;
  } catch {
    return undefined;
  }
};

export const clearStoredAuth = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
};
