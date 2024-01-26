import { createContext } from "react";

interface AuthContextProps {
  auth: {
    token: string;
    userId: string;
    userName: string;
    role: string;
  } | null;
  setAuth: (
    auth: Partial<
      { token: string; userId: string; userName: string; role: string }
    >,
  ) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
