import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0b0f19]">

      <Sidebar collapsed={collapsed} />

      <div className="flex-1">
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}