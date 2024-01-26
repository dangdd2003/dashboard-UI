import UserDashboardAI from "@/apis/UserDashboardAI";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const Register = () => {
  const userRef = useRef<HTMLInputElement>(null);

  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");

  const [response, error, loading, axiosFetch] = useAxiosFunction();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = result && password === confirmPassword;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosFetch({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "/users/create",
      requestConfig: {
        data: {
          username: username,
          password: password,
          userDetail: {
            firstname: firstname,
            lastname: lastname,
            email: email,
          },
        },
      },
    });
    if (response) {
      if (response.status === 201) {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
      }
    }
  };

  return (
    <div>
      <form className="flex flex-col mx-6 mt-10" onSubmit={handleSubmit}>
        <label htmlFor="username" className="mb-2">
          Username
          <span className="text-red-500">*</span>
          <span className={validUsername ? "text-green-500" : "text-red-500"}>
            {username && validUsername ? "valid" : ""}
          </span>
          <span className={validUsername ? "text-green-500" : "text-red-500"}>
            {username && !validUsername ? "invalid" : ""}
          </span>
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
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
        {usernameFocus && username && !validUsername && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              Must contains atleast 8 characters <br />
            </p>
          </div>
        )}
        <label htmlFor="password" className="mb-2">
          Password
          <span className="text-red-500">*</span>
          <span className={validPassword ? "text-green-500" : "text-red-500"}>
            {password && validPassword ? "valid" : ""}
          </span>
          <span className={validPassword ? "text-green-500" : "text-red-500"}>
            {password && !validPassword ? "invalid" : ""}
          </span>
        </label>
        <input
          id="password"
          className="mb-4 p-2 rounded bg-white text-black"
          type="password"
          required
          autoComplete="off"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        {passwordFocus && password && !validPassword && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              Must contains atleast 8 characters <br />
              Must contains atleast one: uppercase letter, lowercase letter,
              number, special character.
            </p>
          </div>
        )}
        <label htmlFor="confirm-password" className="mb-2">
          Confirm Password
          <span className="text-red-500">*</span>
          <span
            className={validConfirmPassword ? "text-green-500" : "text-red-500"}
          >
            {confirmPassword && validConfirmPassword ? "valid" : ""}
          </span>
          <span
            className={validConfirmPassword ? "text-green-500" : "text-red-500"}
          >
            {confirmPassword && !validConfirmPassword ? "invalid" : ""}
          </span>
        </label>
        <input
          id="confirm-password"
          className="mb-4 p-2 rounded bg-white text-black"
          type="password"
          placeholder="Confirm your password"
          required
          autoComplete="off"
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setConfirmPasswordFocus(true)}
          onBlur={() => setConfirmPasswordFocus(false)}
        />
        {confirmPasswordFocus && confirmPassword && !validConfirmPassword && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              Must match password
            </p>
          </div>
        )}
        <label htmlFor="email" className="mb-2">
          Email
          <span className="text-red-500">*</span>
          <span className={validEmail ? "text-green-500" : "text-red-500"}>
            {email && validEmail ? "valid" : ""}
          </span>
          <span className={validEmail ? "text-green-500" : "text-red-500"}>
            {email && !validEmail ? "invalid" : ""}
          </span>
        </label>
        <input
          id="email"
          className="mb-4 p-2 rounded bg-white text-black"
          type="email"
          placeholder="Email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        {emailFocus && email && !validEmail && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              Must be a valid email
            </p>
          </div>
        )}
        <label htmlFor="first-name" className="mb-2">
          First Name
          <span className="text-red-500">*</span>
        </label>
        <input
          id="first-name"
          className="mb-4 p-2 rounded bg-white text-black"
          type="text"
          required
          placeholder="First Name"
          autoComplete="off"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="last-name" className="mb-2">
          Last Name
          <span className="text-red-500">*</span>
        </label>
        <input
          id="last-name"
          className="mb-4 p-2 rounded bg-white text-black"
          type="text"
          required
          placeholder="Last Name"
          autoComplete="off"
          onChange={(e) => setLastName(e.target.value)}
        />
        {response && (
          <div className="flex items-center w-full">
            <InformationCircleIcon className="w-8 h-8 text-gray-300" />
            <p className="border-1 p-1 text-sm text-gray-300 rounded-md">
              {response.status === 201 ? "Successfully registered" : error}
            </p>
          </div>
        )}
        <button
          disabled={!validUsername || !validPassword || !validConfirmPassword ||
            !validEmail}
          className="my-6 p-2 rounded bg-white text-black disabled:opacity-50"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
