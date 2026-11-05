import UserDashboardAI from "@/apis/UserDashboardAI";
import { parseInferenceResult } from "@/apis/inference";
import Container from "@/components/container";
import useAxios from "@/hooks/useAxios";
import { IInference } from "@/interfaces/IInference";
import { Link, useParams } from "react-router";

const InferenceDetail = () => {
  const { inferenceId } = useParams<{ inferenceId: string }>();
  if (!inferenceId) {
    return <div className="text-red-500">Inference ID not found</div>;
  }
  return <InferenceDetailContent inferenceId={inferenceId} />;
};

const InferenceDetailContent = ({ inferenceId }: { inferenceId: string }) => {
  // owner or admin only (403 otherwise)
  const [inferenceResponse, inferenceError, inferenceLoading] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/inferences/" + encodeURIComponent(inferenceId),
  });

  const inference: IInference | undefined =
    inferenceResponse?.status === 200 ? inferenceResponse.data : undefined;
  const parsed = parseInferenceResult(inference?.result);
  const formattedCreateTime = inference?.createTime
    ? new Date(inference.createTime).toLocaleString()
    : "";

  return (
    <Container>
      <div className="mx-auto p-6 rounded-md mt-10 w-3/4">
        {inferenceLoading && <p className="text-blue-500">Loading...</p>}
        {inferenceError && <p className="text-red-500">{inferenceError}</p>}
        {inference && (
          <>
            <div className="mb-8 pb-2 border-b border-gray-300">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Inference #{inference.id}
              </h1>
              <p className="text-gray-500">
                By {inference.firstname} {inference.lastname} · {formattedCreateTime}
              </p>
              <p className="text-gray-500">
                Model:{" "}
                <Link className="text-blue-600 underline" to={`/models/${inference.model_id}`}>
                  #{inference.model_id}
                </Link>
                {inference.resource_id != null && <> · Resource #{inference.resource_id}</>}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
                Result
              </h2>
              <div className="mt-4 text-gray-800 leading-relaxed wrap-break-word">
                {parsed.message && <p>Message: {parsed.message}</p>}
                <p>N: {parsed.result?.N}</p>
                <p>P: {parsed.result?.P}</p>
                <p>K: {parsed.result?.K}</p>
                <p>MSE: {parsed.result?.metrics?.mse}</p>
                <p>R2: {parsed.result?.metrics?.r2}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default InferenceDetail;
