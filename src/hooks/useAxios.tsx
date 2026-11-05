import { getErrorMessage, getErrorStatus } from "@/apis/errors";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

type ConfigType = {
  axiosInstance: AxiosInstance;
  method: string;
  url: string;
  requestConfig?: AxiosRequestConfig;
  timeoutMs?: number;
};

const useAxios = (
  { axiosInstance, method, url, requestConfig, timeoutMs = 15000 }: ConfigType,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>({
    data: {},
    status: 0,
    statusText: "",
  });
  const [error, setError] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const refetch = () => setReload((prev) => !prev);

  useEffect(() => {
    // an empty url means "not ready yet" (e.g. waiting for an id)
    if (!url) return;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setErrorStatus(0);
        const res = await axiosInstance({
          method,
          url,
          ...requestConfig,
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(timeoutMs),
          ]),
        });
        if (import.meta.env.DEV) console.log(res);
        setResponse({
          data: res.data,
          status: res.status,
          statusText: res.statusText,
        });
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const message = getErrorMessage(err);
        console.log(message);
        setError(message);
        setErrorStatus(getErrorStatus(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, url]);

  return [response, error, loading, refetch, errorStatus] as const;
};

export default useAxios;
