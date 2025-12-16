import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/DashBoard/SideBar";

export default function DashBoard() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex bg-black2 border-r-[1px] border-white3 h-[100vh] fixed py-5">
        <SideBar />
      </div>
      {/* Main Content - Full width on mobile, with margin on desktop */}
      <div className="h-[calc(100vh - 3.5rem)] lg:ml-[222px] overflow-auto bg-blue-200 mx-auto w-full lg:w-11/12 p-5">
        <Outlet />
      </div>
    </div>
  );
}


