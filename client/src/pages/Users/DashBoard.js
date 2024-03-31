import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/DashBoard/SideBar";

export default function DashBoard() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <div className=" bg-green-300 flex min-w-[150px] flex-col border-r-[1px] border-black-700 h-[calc(100vh-3.5rem)] bg-black-400 py-5">
        <SideBar />
      </div>
      <div className="h-[calc(100vh - 3.5rem)] overflow-auto bg-blue-200 mx-auto w-11/12 p-5 max-w-[1000px]">
        <Outlet />
      </div>
    </div>
  );
}
