
import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../shared/AppSidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-row">
        <AppSidebar/>
       <Outlet />
    </div>
  );
};

export default MainLayout;