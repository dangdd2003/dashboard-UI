import UserDashboardAI from "@/apis/UserDashboardAI";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { IRating } from "@/interfaces/IRating";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  modelId: number;
};

const RatingsSection = ({ modelId }: Props) => {
  const { auth } = useAuth();
  const [ratingsResponse, ratingsError, ratingsLoading, ratingsRefetch] =
    useAxios({
      axiosInstance: UserDashboardAI,
      method: "get",
      url: "/rating/model_id/" + modelId,
      requestConfig: {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      },
    });

  useEffect(() => {
    if (ratingsResponse?.data) {
      setRatings(ratingsResponse.data);
    }
  }, [ratingsResponse]);

  const [ratings, setRatings] = useState<IRating[]>(
    ratingsResponse?.data ?? [],
  );

  return (
    <div className="mt-8 mr-8">
      <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
        Ratings
      </h2>
      {/* Display Comments */}
      {Array.isArray(ratings) && ratings.length > 0
        ? (
          ratings.map((rating) => (
            <div
              className="flex flex-col border-b border-gray-300 mb-4 pb-4"
              key={rating.id}
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                  <div className="flex justify-center items-center">
                    <img
                      src={"https://picsum.photos/200"}
                      alt=""
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <p className="font-bold">
                      <Link to={`/profile/${rating.username}`}>
                        {rating.username}
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold mr-2">{rating.stars}/5</p>
                  <p className="text-gray-400">
                    {new Date(rating.createTime).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="font-thin mt-2">{rating.comment}</p>
            </div>
          ))
        )
        : <p>No ratings yet</p>}
    </div>
  );
};

export default RatingsSection;
