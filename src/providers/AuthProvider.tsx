import { AuthContext, AuthState } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const storedAuth = localStorage.getItem("auth");
  const [auth, setAuth] = useState<Partial<AuthState> | null>(
    storedAuth ? JSON.parse(storedAuth) : null,
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
