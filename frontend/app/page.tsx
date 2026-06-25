"use client";
import Image from "next/image";
import { useSession } from "../context/SessionContext";
import { useUiStore } from "../stores/uiStore";

export default function Home() {
  const { user, logout } = useSession();
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-black">HRMS</h1>
        <p className="mt-4 text-gray-600">Human Resource Management System</p>
      </div>
    </div>
  );
}
