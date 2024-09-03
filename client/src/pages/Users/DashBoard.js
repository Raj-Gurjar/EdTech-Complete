import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/DashBoard/SideBar";

export default function DashBoard() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <div className=" bg-black2 flex border-r-[1px] border-white3 h-[100vh] fixed py-5">
        <SideBar />
      </div>
      <div className="h-[calc(100vh - 3.5rem)] ml-[222px] overflow-auto bg-blue-200 mx-auto w-11/12 p-5 max-w-[1000px]">
        <Outlet />
      </div>
    </div>
  );
}
