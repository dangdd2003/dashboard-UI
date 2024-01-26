import { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

type ConfigType = {
  axiosInstance: AxiosInstance;
  method: string;
  url: string;
  requestConfig?: Object;
};

const useAxios = (
  { axiosInstance, method, url, requestConfig }: ConfigType,
) => {
  const [response, setResponse] = useState<any>({
    data: {},
    status: 0,
    statusText: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const refetch = () => setReload((prev) => !prev);

  useEffect(() => {
    //let isMounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await axiosInstance({
          method,
          url,
          ...requestConfig,
          signal: AbortSignal.timeout(5000),
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

    // call the function
    fetchData();

    // useEffect cleanup function
    return () => controller.abort();

    // eslint-disable-next-line
  }, [reload]);

  return [response, error, loading, refetch] as const;
};

export default useAxios;
