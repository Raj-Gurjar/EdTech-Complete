import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { navItems } from "../../data/SideBarData";
import { RootState } from "../../toolkit/reducer";


export default function SideBar() {
  const { user } = useSelector((state: RootState) => state.profile);

  // Filter navItems based on user account type
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.accountType || "")
  );

  return (
    <div className="">
      <ul className="w-full flex gap-y-2 flex-col justify-center min-w-[222px]">
        {filteredNavItems.map((item, index) => (
          <li key={index} className="">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-purple6 py-1 text-white font-bold flex items-center px-5 rounded-lg transition-all duration-200"
                  : "flex items-center px-5 py-1 text-white4 hover:text-white hover:bg-black3 rounded-lg transition-all duration-200"
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}


