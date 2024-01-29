import { TestIdContext } from "@/contexts/TestIdContext";
import { ReactNode, useState } from "react";

interface TestIdProviderProps {
  children: ReactNode;
}

interface TestIdState {
  modelId: number;
  resourceId: number;
}

const TestIdProvider = ({ children }: TestIdProviderProps) => {
  const storedTestId = localStorage.getItem("testId");
  const [ids, setIds] = useState<TestIdState | null>(storedTestId ? JSON.parse(storedTestId) : null);

  return (
    <TestIdContext.Provider value={{ ids, setIds }}>
      {children}
    </TestIdContext.Provider>
  );
};

export default TestIdProvider;
