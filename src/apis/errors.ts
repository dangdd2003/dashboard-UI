import { isAxiosError } from "axios";

/**
 * Turn an axios error into a readable message.
 *
 * dashboard-user (v2.0) returns errors either as plain text
 * (e.g. "Not found!", "Username already exists") or, for validation errors,
 * as a JSON object `{"<field>": "<message>"}`.
 */
export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const data: unknown = err.response?.data;
    let detail = "";
    if (typeof data === "string") {
      detail = data.trim();
    } else if (data && typeof data === "object" && !(data instanceof Blob)) {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === "string") {
        detail = obj.message;
      } else {
        detail = Object.entries(obj)
          .map(([field, msg]) => `${field}: ${String(msg)}`)
          .join("; ");
      }
    }
    if (!status) {
      return err.code === "ERR_CANCELED" || err.name === "CanceledError"
        ? "Request timed out or was cancelled"
        : err.message || "Network error";
    }
    const fallback: Record<number, string> = {
      400: "Invalid request",
      401: "Not authenticated, please sign in again",
      403: "You are not allowed to do this",
      404: "Not found",
      409: "Conflict",
      502: "The ML service returned an error",
      503: "The ML service is unreachable",
      504: "The ML service timed out",
    };
    return `${status}: ${detail || fallback[status] || err.message}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
};

export const getErrorStatus = (err: unknown): number =>
  isAxiosError(err) ? (err.response?.status ?? 0) : 0;
