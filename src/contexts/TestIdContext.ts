import { createContext, Dispatch, SetStateAction } from "react";

export interface TestIdState {
  modelId: number;
  resourceId: number;
}

interface TestIdContextProps {
  ids: Partial<TestIdState> | null;
  setIds: Dispatch<SetStateAction<Partial<TestIdState> | null>>;
}

export const TestIdContext = createContext<TestIdContextProps | null>(null);
