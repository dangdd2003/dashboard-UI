import { AuthContext } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState {
  token: string;
  userId: string;
  userName: string;
  role: string;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const storedAuth = localStorage.getItem("auth");
  const [auth, setAuth] = useState<AuthState | null>(storedAuth ? JSON.parse(storedAuth) : null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
