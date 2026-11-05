import { getErrorMessage, getErrorStatus } from "@/apis/errors";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

type ConfigType = {
  axiosInstance: AxiosInstance;
  method: string;
  url: string;
  requestConfig?: AxiosRequestConfig;
  /** Client-side timeout. ML endpoints may take up to 300 s on the backend. */
  timeoutMs?: number;
};

const useAxiosFunction = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<{ data: any; status: number; statusText: string }>({
    data: "",
    status: 0,
    statusText: "",
  });
  const [error, setError] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const axiosFetch = async (
    config: ConfigType,
  ): Promise<AxiosResponse | undefined> => {
    const { axiosInstance, method, url, requestConfig, timeoutMs = 60000 } =
      config;
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    try {
      setLoading(true);
      setError("");
      setErrorStatus(0);
      const res = await axiosInstance({
        method,
        url,
        ...requestConfig,
        signal: AbortSignal.any([ctrl.signal, AbortSignal.timeout(timeoutMs)]),
      });
      if (import.meta.env.DEV) console.log(res);
      setResponse({
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      });
      return res;
    } catch (err: unknown) {
      if (ctrl.signal.aborted) return undefined;
      const message = getErrorMessage(err);
      console.log(message);
      setError(message);
      setErrorStatus(getErrorStatus(err));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // abort an in-flight request when the component unmounts
  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return [response, error, loading, axiosFetch, errorStatus] as const;
};

export default useAxiosFunction;
