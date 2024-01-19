import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import TableDatasets from "@/components/table/datasets";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import Models from "@/screens/models/model-list";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { auth } = useAuth();
  const { username } = useParams();
  const [selectedButton, setSelectedButton] = useState<string | null>("models");
  const [userId, setUserId] = useState<number | null>(null);

  const isAboveMedium = useMediaQuery({ minWidth: 768 });

  const [response, error, loading, refetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/users/profile?username=" + username,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  useEffect(() => {
    if (response?.data) {
      setUserId(response.data.id);
    }
  }, [response]);

  const formattedCreateTime = response?.data?.createTime
    ? new Date(response?.data?.createTime).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <Container>
      <div className="flex flex-col items-center justify-center">
        <img src={`http://146.190.100.81:8081/file/get-avatar?id=${response?.data.id}`} alt="" className="w-60 h-60 rounded-full" />
        <h1 className="text-2xl font-bold my-2">{response.data.username}</h1>
        <span className="flex flex-col font-thin items-center justify-center">
          <p>Joined: {formattedCreateTime}</p>
          <p>Role: {auth?.role}</p>
        </span>
      </div>
      <div
        className={`flex w-auto h-auto mt-5 justify-center shadow-lg mb-5 ${isAboveMedium ? "w-auto" : "w-3/4 mx-20"
          }`}
      >
        <div
          className={`hover:bg-slate-300 pt-5 px-5`}
          onClick={() => setSelectedButton("resources")}
        >
          <button
            className={`pb-2 border-gray-500 ${selectedButton === "resources" ? "border-b-4" : ""
              }`}
          >
            Resources
          </button>
        </div>
        <div
          className={`hover:bg-slate-300 pt-5 px-5`}
          onClick={() => setSelectedButton("models")}
        >
          <button
            className={`pb-3 border-gray-500 ${selectedButton === "models" ? "border-b-4" : ""
              }`}
          >
            Models
          </button>
        </div>
      </div>
      {selectedButton === "models" && userId !== undefined && (
        <div>
          <Models userID={userId || 0} />
        </div>
      )}
      {selectedButton === "resources" && userId !== undefined && (
        <div>
          <TableDatasets userId={userId || 0} />
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
