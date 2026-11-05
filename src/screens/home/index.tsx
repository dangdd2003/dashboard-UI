import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { HomeData } from "./HomeData";
import Counter from "@/components/counter";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const { auth, setAuth } = useAuth();
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  // without `username` the backend returns the caller's own profile
  const [response] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/users/profile",
  });

  // keep id / role in sync with the backend (e.g. after an admin changed the role)
  useEffect(() => {
    if (response?.status === 200 && response.data?.id != null) {
      setAuth((prev) => ({
        ...prev,
        userName: response.data.username ?? prev?.userName,
        role: response.data.role,
        userId: String(response.data.id),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const userId = response?.data?.id ?? auth?.userId;

  const [modelsResponse] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: userId != null ? `/models/models-by-user?user_id=${userId}` : "",
  });
  const [ratingsResponse] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: userId != null ? `/ratings/user_id?user_id=${userId}` : "",
  });

  const counts = [
    Array.isArray(modelsResponse?.data) ? modelsResponse.data.length : 0,
    Array.isArray(ratingsResponse?.data) ? ratingsResponse.data.length : 0,
  ];

  return (
    <Container>
      <div>
        <h1 className={`flex justify-center font-bold ${isAboveMedium ? "text-5xl" : "text-3xl "}`}>
          Welcome, {auth?.userName}
        </h1>
        <div className="flex justify-center gap-3 mt-10">
          {HomeData.map((data, index) => (
            <span className="" key={index}>
              <Counter data={{ ...data, count: counts[index] ?? data.count }} />
            </span>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;
