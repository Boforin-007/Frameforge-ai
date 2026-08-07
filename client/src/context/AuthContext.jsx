import { useEffect, useMemo, useState } from "react";
import { APP } from "../constants/appConstants.js";
import { login as loginRequest, fetchCurrentUser } from "../services/authService.js";
import { AuthContext } from "./authContext.js";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(APP.storageKeys.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(APP.storageKeys.user);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(APP.storageKeys.token));
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(APP.storageKeys.token)));

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    fetchCurrentUser()
      .then((data) => {
        if (active) {
          setUser(data);
          localStorage.setItem(APP.storageKeys.user, JSON.stringify(data));
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(APP.storageKeys.token);
          localStorage.removeItem(APP.storageKeys.user);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      login: async (credentials) => {
        const data = await loginRequest(credentials);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(APP.storageKeys.token, data.token);
        localStorage.setItem(APP.storageKeys.user, JSON.stringify(data.user));
        return data;
      },
      logout: () => {
        localStorage.removeItem(APP.storageKeys.token);
        localStorage.removeItem(APP.storageKeys.user);
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
