import { createContext, Dispatch, SetStateAction } from "react";

export interface AuthState {
  token: string;
  userId: string;
  userName: string;
  role: string;
}

interface AuthContextProps {
  auth: Partial<AuthState> | null;
  setAuth: Dispatch<SetStateAction<Partial<AuthState> | null>>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
