import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useParams } from "react-router-dom";

const InferenceDetail = () => {
  const { auth } = useAuth();
  const { inferenceId } = useParams<{ inferenceId: string }>();
  if (!inferenceId) {
    return <div className="text-red-500">Inference ID not found</div>;
  }
  const [
    inferenceResponse,
    inferenceError,
    inferenceLoading,
    inferenceRefetch,
  ] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/inferences/by-model/" + inferenceId,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  return (
    <Container>
      <div className="mx-auto p-6 rounded-md mt-10 w-3/4">
        <div className="mb-8 pb-2 border-b border-gray-300">
          {/* <h1 className="text-3xl md:text-4xl font-bold mb-2">{model.name}</h1> */}
          <p className="text-gray-500">
            Owner:{" "}
            {/* <Link to={`/profile/${model.username}`}>{model.username}</Link> */}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
            Description
          </h2>
          <p className="text-gray-800 leading-relaxed break-words font-thin">
            {/* {model.description} */}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
            Model Details
          </h2>
          <div className="mt-4 text-gray-800 leading-relaxed break-words font-thin">
            {
              /* <p>Type: {model.type}</p>
            <p>Stars: {model.stars}</p>
            <p>Usage: {model.usageCount}</p>
            <p>Created Time: {formattedCreateTime}</p> */
            }
          </div>
        </div>
      </div>
    </Container>
  );
};

export default InferenceDetail;
