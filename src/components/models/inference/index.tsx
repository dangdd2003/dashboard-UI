import UserDashboardAI from "@/apis/UserDashboardAI";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { IInference } from "@/interfaces/IInference";
import { useEffect, useState } from "react";

type Props = {
  modelId: number;
};

const Inference = ({ modelId }: Props) => {
  const { auth } = useAuth();
  const [
    inferenceResponse,
    inferenceError,
    inferenceLoading,
    inferenceRefetch,
  ] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/inferences/by-model",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      params: {
        model_id: modelId,
      },
    },
  });

  const [inferences, setInferences] = useState<IInference[]>(inferenceResponse?.data);


  useEffect(() => {
    if (inferenceResponse?.data) {
      console.log(inferenceResponse.data);
      setInferences(inferenceResponse.data);
    }
  }, [inferenceResponse]);


  return (
    <div className="mt-8 mr-8  w-full">
      <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
        Inferences
      </h2>
      <div className="flex overflow-x-auto">
        {inferenceResponse.data && Array.isArray(inferences) && inferences.length > 0 &&
          inferences.map((inference) => {
            const result = JSON.parse(inference.result);
            return (
              <div
                className="flex flex-col h-auto w-full border-2 gap-5 p-5 rounded-lg shadow-lg mb-4"
                key={inference.id}
              >
                <span>IID: {inference.id}</span>
                <span>K: {result.result.K}</span>
                <span>N: {result.result.N}</span>
                <span>P: {result.result.P}</span>
                <span>MSE: {result.result.metrics.mse}</span>
                <span>R2: {result.result.metrics.r2}</span>
              </div>
            );
          })
        }
      </div>
      {inferenceError && (
        <div className="text-red-500">
          <p>{inferenceError}</p>
        </div>
      )}
      {inferenceLoading && (
        <div className="text-gray-500">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Inference;
