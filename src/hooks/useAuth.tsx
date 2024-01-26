import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { auth, setAuth } = context;

  // Load auth state from cookies when component mounts
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  // Save auth state to cookies whenever it changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return { auth, setAuth };
};

export default useAuth;
