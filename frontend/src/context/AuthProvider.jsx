import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "./auth.js";
import { api, getToken, setToken } from "../lib/api.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // Logged in from an earlier visit? Load the student.
  useEffect(() => {
    if (!getToken()) return;

    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async (details) => {
    const data = await api("/api/auth/register", { method: "POST", body: details });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // After a password reset the server logs the student straight in.
  const acceptLogin = useCallback((token, loggedInUser) => {
    setToken(token);
    setUser(loggedInUser);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, acceptLogin, setUser }),
    [user, loading, login, signup, logout, acceptLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
