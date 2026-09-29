import React, { useState } from "react";
import AuthContext from "./AuthContext";
import type { AuthUser } from "../models/AuthModel";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);

    if (newUser) {
      localStorage.setItem("authUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("authUser");
    }
  };

  const logoutUser = () => {
    setUserState(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;