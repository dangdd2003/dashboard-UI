import { createContext } from "react";

interface TestIdContextProps {
  ids: {
    modelId: number;
    resourceId: number;
  } | null;
  setIds: (
    ids: Partial<{ modelId: number; resourceId: number }>,
  ) => void;
}

export const TestIdContext = createContext<TestIdContextProps | null>(null);
