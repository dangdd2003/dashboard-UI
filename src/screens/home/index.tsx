import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { HomeData } from "./HomeData";
import Counter from "@/components/counter";
import { useMediaQuery } from "react-responsive";
import TableDatasets from "@/components/table/datasets";
import Models from "../models/model-list";

const Home = () => {
  const { auth } = useAuth();
  const { setAuth } = useAuth();
  // const [selectedButton, setSelectedButton] = useState<string | null>("models");
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  const [response, error, loading, refetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/users/profile?username=" + auth?.userName,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  const [,,,,] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/file/get-avatar",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      param: {
        id: auth?.userId,
      }
    },
  }); 

  useEffect(() => {
    if (response.data) {
      setAuth({
        token: auth!.token,
        userName: auth!.userName,
        role: response.data.role,
        userId: response.data.id,
      });
    }
  }, [response]);

  // const formattedCreateTime = response?.data?.createTime
  //   ? new Date(response?.data?.createTime).toLocaleDateString(undefined, {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   })
  //   : "";

  console.log(auth?.userId);
  return (
    <Container>
      <div>
        <h1 className="flex justify-center text-5xl font-bold">
          Welcome, {auth?.userName}
        </h1>
        {
          /* <span className="flex flex-col font-thin items-center justify-center">
          <p>Joined: {formattedCreateTime}</p>
          <p>Role: {auth?.role}</p>
        </span> */
        }

        <div className="flex justify-center gap-3 mt-10">
          {HomeData.map((data, index) => (
            <span className="" key={index}>
              <Counter data={data} />
            </span>
          ))}
        </div>
        {
          /*
      <div
        className={`flex w-auto h-auto mt-5 justify-center shadow-lg mb-5 ${
          isAboveMedium ? "w-auto" : "w-3/4 mx-20"
        }`}
      >
        <div
          className={`hover:bg-slate-300 pt-5 px-5`}
          onClick={() => setSelectedButton("resources")}
        >
          <button
            className={`pb-2 border-gray-500 ${
              selectedButton === "resources" ? "border-b-4" : ""
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
            className={`pb-3 border-gray-500 ${
              selectedButton === "models" ? "border-b-4" : ""
            }`}
          >
            Models
          </button>
        </div>
      </div>
      {selectedButton === "models" && auth?.userId !== undefined && (
        <div>
          <Models userID={Number(auth?.userId) || 0} />
        </div>
      )}
      {selectedButton === "resources" && auth?.userId !== undefined && (
        <div>
          <TableDatasets userId={Number(auth?.userId) || 0} />
        </div>
      )} */
        }
      </div>
    </Container>
  );
};

export default Home;
