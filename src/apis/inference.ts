// `InferenceDto.result` is the raw JSON string returned by the ML service, e.g.
// {"message":"...","result":{"N":1.2,"P":0.4,"K":2.1,"metrics":{"mse":0.01,"r2":0.97}}}
export interface InferenceResult {
  message?: string;
  result?: {
    N?: number;
    P?: number;
    K?: number;
    metrics?: { mse?: number; r2?: number };
  };
}

export const parseInferenceResult = (raw: unknown): InferenceResult => {
  if (raw && typeof raw === "object") return raw as InferenceResult;
  if (typeof raw !== "string" || raw.trim() === "") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { message: raw };
  }
};
