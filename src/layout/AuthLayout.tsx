import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center">
      <div className="max-w-md  bg-white border border-gray-400 rounded-2xl p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;