import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, History } from "lucide-react";

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/home", icon: LayoutDashboard },
    { name: "Detect", path: "/detect", icon: Search },
    { name: "History", path: "/history", icon: History },
  ];

  return (
    <div className={`${collapsed ? "w-20" : "w-64"} 
    hidden md:flex flex-col transition-all duration-300
    bg-white dark:bg-gray-900 border-r p-4`}>

      <h1 className="text-xl font-bold mb-8 text-center">
        {collapsed ? "🧠" : "MentalAI"}
      </h1>

      {menu.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg
            ${active ? "bg-purple-500 text-white" : ""}`}
          >
            <Icon size={18} />
            {!collapsed && item.name}
          </Link>
        );
      })}
    </div>
  );
}