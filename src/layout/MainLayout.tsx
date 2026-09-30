
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../shared/AppSidebar";
import TopBar from "../shared/TopBar";

const MainLayout: React.FC = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="w-screen h-screen flex flex-row">
            <div className="hidden md:block h-full">
                <AppSidebar />
            </div>
            
            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${mobileSidebarOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setMobileSidebarOpen(false)}
                />

                {/* Sidebar */}
                <div
                    className={`absolute left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${mobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                        }`}
                >
                    <AppSidebar />
                </div>
            </div>

            <div className="flex flex-col w-full h-full">
                <TopBar
                    onMenuClick={() =>
                        setMobileSidebarOpen(prev => !prev)
                    }
                />
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;