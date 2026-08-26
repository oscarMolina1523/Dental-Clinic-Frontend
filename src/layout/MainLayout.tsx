
import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../shared/AppSidebar";
import TopBar from "../shared/TopBar";

const MainLayout: React.FC = () => {
    return (
        <div className="w-screen h-screen flex flex-row">
            <AppSidebar />
            <div className="flex flex-col w-full h-full">
                <TopBar />
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;