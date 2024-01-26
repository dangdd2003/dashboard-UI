// Login.tsx
import SecurityDashboardAI from "@/apis/SecurityDashboardAI";
import useAuth from "@/hooks/useAuth";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const { setAuth } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, error, loading, axiosFetch] = useAxiosFunction();
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    if (response) {
      const accessToken = response?.data;
      if (accessToken) {
        setAuth({
          token: accessToken,
          userName: username,
        });
        navigate("/home");
      }
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authString = "Basic " + btoa(username + ":" + password);
    axiosFetch({
      axiosInstance: SecurityDashboardAI,
      method: "post",
      url: "/jwt",
      requestConfig: {
        headers: {
          Authorization: authString,
        },
      },
    });
  };

  return (
    <div>
      <form className="flex flex-col mx-6 mt-10" onSubmit={handleSubmit}>
        <label htmlFor="username" className="mb-2">
          Username
        </label>
        <input
          id="username"
          className="mb-4 p-2 rounded bg-white text-black"
          ref={userRef}
          required
          type="text"
          placeholder="username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password" className="mb-2">
          Password
        </label>
        <input
          id="password"
          className="mb-4 p-2 rounded bg-white text-black"
          type="password"
          required
          autoComplete="off"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {response && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              {response.status === 200 ? "Successfully login" : error}
            </p>
          </div>
        )}
        <button
          className="p-2 rounded bg-white text-black my-6"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
