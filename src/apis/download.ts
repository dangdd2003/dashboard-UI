import { AxiosInstance } from "axios";

const fileNameFromDisposition = (header: unknown): string | undefined => {
  if (typeof header !== "string") return undefined;
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const baseName = (filepath: string | null | undefined): string => {
  if (!filepath) return "";
  const parts = filepath.split(/[\\/]/);
  return parts[parts.length - 1];
};

/**
 * Download a binary file (`application/octet-stream`) from the backend and save it.
 * `Content-Disposition` is only readable when the backend exposes it via CORS, so a
 * fallback name (usually the base name of the stored `filepath`) is used otherwise.
 */
export const downloadFile = async (
  axiosInstance: AxiosInstance,
  url: string,
  params: Record<string, unknown>,
  fallbackName: string,
) => {
  const res = await axiosInstance.get<Blob>(url, {
    params,
    responseType: "blob",
    timeout: 600000,
  });
  const name =
    fileNameFromDisposition(res.headers["content-disposition"]) ||
    fallbackName ||
    "download";
  const href = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
