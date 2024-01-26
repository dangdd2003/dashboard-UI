import { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

type ConfigType = {
  axiosInstance: AxiosInstance;
  method: string;
  url: string;
  requestConfig?: Object;
};

const useAxiosFunction = () => {
  const [response, setResponse] = useState({
    data: "",
    status: 0,
    statusText: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController>();

  const axiosFetch = async (config: ConfigType): Promise<void> => {
    const { axiosInstance, method, url, requestConfig } = config;
    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const res = await axiosInstance({
        method,
        url,
        ...requestConfig,
        signal: AbortSignal.timeout(50000),
      });
      console.log(res);
      setResponse({
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      });
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => controller && controller.abort();
  }, [controller]);

  return [response, error, loading, axiosFetch] as const;
};

export default useAxiosFunction;
