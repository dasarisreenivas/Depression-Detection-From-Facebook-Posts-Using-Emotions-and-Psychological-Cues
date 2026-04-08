import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b
    bg-white dark:bg-gray-900 text-gray-800 dark:text-white">

      <div className="flex items-center gap-4">
        <Menu onClick={toggleSidebar} className="cursor-pointer" />

        <h1 onClick={() => navigate("/home")} className="font-bold cursor-pointer">
          MentalAI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme}>
          {dark ? <Sun /> : <Moon />}
        </button>

        <span>{user?.email}</span>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-red-500 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}