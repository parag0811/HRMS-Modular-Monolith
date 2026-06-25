"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Users, Clock, CalendarOff, CheckSquare } from "lucide-react";

// --- Dummy Data ---

const recentActivity = [
  {
    name: "John",
    action: "clocked in",
    time: "2 min ago",
    dot: "bg-[#1D9E75]",
  },
  {
    name: "Priya",
    action: "applied for leave",
    time: "15 min ago",
    dot: "bg-[#EF9F27]",
  },
  {
    name: "Rahul",
    action: "completed a todo",
    time: "40 min ago",
    dot: "bg-[#378ADD]",
  },
  {
    name: "Aman",
    action: "clocked out",
    time: "1 hr ago",
    dot: "bg-[#D85A30]",
  },
  {
    name: "Riya",
    action: "updated attendance",
    time: "2 hr ago",
    dot: "bg-[#1D9E75]",
  },
];

const leaveRequests = [
  { name: "John", type: "Casual", dates: "Jun 26–28", status: "pending" },
  { name: "Rahul", type: "Sick", dates: "Jun 27", status: "approved" },
  { name: "Priya", type: "Personal", dates: "Jul 1–3", status: "rejected" },
  { name: "Aman", type: "Casual", dates: "Jul 5", status: "pending" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-[#FAEEDA] text-[#854F0B]",
  approved: "bg-[#EAF3DE] text-[#3B6D11]",
  rejected: "bg-[#FCEBEB] text-[#A32D2D]",
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Section 1 — Heading */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back, Rahul</p>
      </div>

      {/* Section 2 — Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total employees"
          value="120"
          description="Total Employees"
          icon={Users}
          delta="+4 this month"
          deltaType="up"
          color="teal"
        />
        <StatCard
          title="Today's attendance"
          value="95%"
          description="Today's Attendance"
          icon={Clock}
          delta="+2% vs yesterday"
          deltaType="up"
          color="amber"
        />
        <StatCard
          title="Pending leave requests"
          value="12"
          description="Pending Requests"
          icon={CalendarOff}
          delta="3 need action"
          deltaType="neutral"
          color="coral"
        />
        <StatCard
          title="Open todos"
          value="18"
          description="Open Tasks"
          icon={CheckSquare}
          delta="6 closed today"
          deltaType="up"
          color="blue"
        />
      </div>

      {/* Section 3 + 4 — Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Section 3 — Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent activity
            </h2>
            <button className="text-xs text-[#1D9E75] hover:underline">
              View all
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                {/* Colored dot */}
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>{" "}
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 — Pending Leave Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Leave requests
            </h2>
            <button className="text-xs text-[#1D9E75] hover:underline">
              See all
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {leaveRequests.map((l, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {l.type} · {l.dates}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[l.status]}`}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
