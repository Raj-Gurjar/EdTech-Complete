import React from "react";
import { SideBarLinks } from "../../data/Dashboard-links";
import { logout } from "../../services/operations/authAPI";
import { useSelector } from "react-redux";
import * as Icons from "react-icons/vsc";
import { matchRoutes, useLocation } from "react-router-dom";

export default function SideBar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return <div className="mt-10">Loading...</div>;
  }

  const Icon = Icons[IconName];
//   const location = useLocation();
  return (
    <div>
      <div className="flex min-w-[222px] flex-col border-r-[1px] border-black-700 h-[calc(100vh-3.5rem)] bg-black-400 py-10">
        <div className="flex flex-col">
          {SideBarLinks.map((link, index) => {
            if (link.type && user?.accoutType !== link.type) return null;
            return 
          })}
        </div>
      </div>
    </div>
  );
}
