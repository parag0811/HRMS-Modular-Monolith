"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  CalendarOff, 
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employee", href: "/employee", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leave", href: "/leave", icon: CalendarOff },
  { name: "Todo", href: "/todo", icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">H</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">HRMS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Overview
        </div>
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-gray-900" : "text-gray-400"} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
            {/* Placeholder avatar */}
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">{role} View</p>
          </div>
        </div>
      </div>
    </aside>
  );
}