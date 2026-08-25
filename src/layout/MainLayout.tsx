
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
       <Outlet />
    </div>
  );
};

export default MainLayout;