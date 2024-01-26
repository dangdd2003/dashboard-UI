import Login from "@/components/authenticate/login";
import Register from "@/components/authenticate/register";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Authenticate = () => {
  const savedIsLogin = localStorage.getItem("isLogin");
  const [isLogin, setIsLogin] = useState(
    savedIsLogin ? JSON.parse(savedIsLogin) : true,
  );
  const isAboveMedium = useMediaQuery({ minWidth: 768 });

  // Save to localStorage whenever isLogin changes
  useEffect(() => {
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  return (
    <div
      className={`${
        isAboveMedium ? "flex" : "flex-col"
      } h-screen bg-blue-900 text-white w-screen overflow-auto`}
    >
      <div
        className={`${
          isAboveMedium ? "w-2/5" : "h-1/4"
        } flex flex-col bg-blue-950 p-10 justify-center overflow-auto`}
      >
        <h1 className="text-5xl font-bold">MPAP</h1>
        <p className="mt-4 text-xl">A multi platform app</p>
        <p className="text-xl">For Nitro, Phospho and Kali prediction</p>
      </div>
      {/* LOGIN AND REGISTER */}
      <div
        className={`${isAboveMedium ? "w-3/5 h-full" : "h-full"} ${
          isLogin ? "h-full" : "h-full"
        } p-10 flex flex-col items-center justify-center overflow-auto bg-black`}
      >
        <div className="border-2 w-[400px] h-full flex flex-col rounded-3xl">
          <div className="flex mt-10 mb-5 text-xl font-light justify-center gap-10">
            <button
              className={`transition-all duration-300 ${
                isLogin ? "border-b-2 border-white" : ""
              } hover:bg-white hover:text-black`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`transition-all duration-300 ${
                isLogin ? "" : "border-b-2 border-white"
              } hover:bg-white hover:text-black`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
          <div>
            {isLogin ? <Login /> : <Register />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
