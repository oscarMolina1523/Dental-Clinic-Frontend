import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center">
        <Outlet />
    </div>
  );
};

export default AuthLayout;