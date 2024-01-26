import Container from "@/components/container";
import TableUsers from "@/components/table/users";

import { useMediaQuery } from "react-responsive";

const UserManagement = () => {
  const isAboveMedium = useMediaQuery({ query: '(min-width: 768px)' });
  return (
    <Container>
      <h1 className={`flex justify-center font-bold ${isAboveMedium ? "text-5xl" : "text-3xl"}`}>User Management</h1>
      <div className={`flex gap-3 mt-10 ${isAboveMedium ? "" : " ml-0 w-5/6"}`}>
        <TableUsers />
      </div>
    </Container>
  );
};

export default UserManagement;
