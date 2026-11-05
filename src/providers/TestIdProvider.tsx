import { TestIdContext, TestIdState } from "@/contexts/TestIdContext";
import { ReactNode, useState } from "react";

interface TestIdProviderProps {
  children: ReactNode;
}

const TestIdProvider = ({ children }: TestIdProviderProps) => {
  const storedTestId = localStorage.getItem("testId");
  const [ids, setIds] = useState<Partial<TestIdState> | null>(
    storedTestId ? JSON.parse(storedTestId) : null,
  );

  return (
    <TestIdContext.Provider value={{ ids, setIds }}>
      {children}
    </TestIdContext.Provider>
  );
};

export default TestIdProvider;
