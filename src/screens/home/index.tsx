import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { HomeData } from "./HomeData";
import Counter from "@/components/counter";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const { auth } = useAuth();
  const { setAuth } = useAuth();
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

  return (
    <Container>
      <div>
        <h1 className={`flex justify-center font-bold ${isAboveMedium ? "text-5xl" : "text-3xl "}`}>
          Welcome, {auth?.userName}
        </h1>
        <div className="flex justify-center gap-3 mt-10">
          {HomeData.map((data, index) => (
            <span className="" key={index}>
              <Counter data={data} />
            </span>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;
