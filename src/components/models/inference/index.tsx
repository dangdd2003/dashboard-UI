import UserDashboardAI from "@/apis/UserDashboardAI";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { IInference } from "@/interfaces/IInference";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    url: "/inferences/by-model/" + modelId,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  useEffect(() => {
    if (inferenceResponse?.data) {
      setInferences(inferenceResponse.data);
    }
  }, [inferenceResponse]);

  const [inferences, setInferences] = useState<IInference[]>(
    inferenceResponse?.data ?? [],
  );
  return (
    <div className="mt-8 mr-8 w-full">
      <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
        Inferences
      </h2>
      <div className="flex">
        {Array.isArray(inferences) && inferences.length > 0
          ? (
            inferences.map((inference) => (
              <Link
                to={`/inference/${inference.id}`}
                className="flex flex-col border-2 gap-5 p-5 rounded-lg shadow-lg mb-4 pb-4"
                key={inference.id}
              >
                <span>IID: {inference.id}</span>
                <span>RID: {inference.resource_id}</span>
                <span>MID: {inference.model_id}</span>
              </Link>
            ))
          )
          : (
            <div className="flex flex-col border-b border-gray-300 mb-4 pb-4">
              <p className="font-thin mt-2">No inference available</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Inference;
