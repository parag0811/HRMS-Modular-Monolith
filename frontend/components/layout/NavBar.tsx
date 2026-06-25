"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ShieldAlert } from "lucide-react";
import { useRole, Role } from "@/context/RoleContext";

export default function Navbar() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  // Create simple breadcrumb from pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const pageTitle = pathSegments.length > 0 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : "Dashboard";

  // Formatted date (e.g. "Wed, Jun 26")
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Breadcrumb / Page Title */}
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <span>HRMS</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{pageTitle}</span>
          </div>
        </div>
        
        {/* Demo Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
          <ShieldAlert size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Demo Simulation</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Selector */}
        <div className="flex items-center gap-2 mr-2 bg-gray-200 rounded-lg p-1">
          <span className="text-xs text-gray-700 font-bold hidden sm:block pl-2">Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="text-sm font-bold text-black bg-white border border-gray-300 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer shadow-sm"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>

        <span className="text-sm font-medium text-gray-500 hidden sm:block">
          {today}
        </span>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}