import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="border-b p-6 text-2xl font-bold">
        HRMS
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/todo">Todo</Link>
        <Link href="/attendance">Attendance</Link>
        <Link href="/leave">Leave</Link>
      </nav>
    </aside>
  );
}