import { createContext } from "react";
import type { AuthUser } from "../models/AuthModel";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;