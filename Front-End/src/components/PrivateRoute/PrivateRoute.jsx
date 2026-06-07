import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("authToken");

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoute;