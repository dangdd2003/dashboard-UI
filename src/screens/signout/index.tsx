import Container from "@/components/container";

const SignOut = () => {
  const handleSignOut = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };
  return (
    <Container>
      <h1 className="text-5xl font-bold">SignOut</h1>
      <button onClick={handleSignOut} className="mt-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Ya sure?</button>
    </Container>
  );
};

export default SignOut;
