"use client";

import { useQuery } from "@apollo/client/react";
import StatCard from "@/components/dashboard/StatCard";
import { Users, Clock, CalendarOff, CheckSquare, Loader2 } from "lucide-react";

import { GET_ALL_EMPLOYEES } from "@/graphql/query/getEmployees";
import { GET_ALL_ATTENDANCES } from "@/graphql/query/getAttendances";
import { GET_ALL_LEAVES } from "@/graphql/query/getLeaves";
import { GET_ALL_TODOS } from "@/graphql/query/getTodos";

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
  const commonVars = {
    request: {
      pageCriteria: { enablePage: false, pageSize: 1, skip: 0 },
    },
  };

  const { data: empData, loading: empLoading } = useQuery<any>(GET_ALL_EMPLOYEES, { variables: commonVars, fetchPolicy: "cache-and-network" });
  const { data: attData, loading: attLoading } = useQuery<any>(GET_ALL_ATTENDANCES, { variables: commonVars, fetchPolicy: "cache-and-network" });
  const { data: leaveData, loading: leaveLoading } = useQuery<any>(GET_ALL_LEAVES, { variables: commonVars, fetchPolicy: "cache-and-network" });
  const { data: todoData, loading: todoLoading } = useQuery<any>(GET_ALL_TODOS, { variables: commonVars, fetchPolicy: "cache-and-network" });

  const totalEmployees = empData?.getAllEmployees?.data?.employees?.length || 0;
  // Use meta totalCount if available, otherwise array length
  const totalAttendances = attData?.getAllAttendances?.meta?.totalCount ?? attData?.getAllAttendances?.data?.attendances?.length ?? 0;
  const totalLeaves = leaveData?.getAllLeaves?.meta?.totalCount ?? leaveData?.getAllLeaves?.data?.leaves?.length ?? 0;
  const totalTodos = todoData?.getAllTodos?.meta?.totalCount ?? todoData?.getAllTodos?.data?.todos?.length ?? 0;

  const isLoading = empLoading || attLoading || leaveLoading || todoLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-[#1D9E75] mb-4" />
        <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-full rounded-2xl shadow-inner">
      {/* Section 1 — Heading */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening in your organization today.</p>
        </div>
      </div>

      {/* Section 2 — Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          description="Registered Staff"
          icon={Users}
          delta="Up to date"
          deltaType="neutral"
          color="teal"
        />
        <StatCard
          title="Attendance Records"
          value={totalAttendances.toString()}
          description="Logged Entries"
          icon={Clock}
          delta="System-wide"
          deltaType="neutral"
          color="amber"
        />
        <StatCard
          title="Leave Requests"
          value={totalLeaves.toString()}
          description="Total Leaves"
          icon={CalendarOff}
          delta="Submitted"
          deltaType="neutral"
          color="coral"
        />
        <StatCard
          title="Total Todos"
          value={totalTodos.toString()}
          description="Tasks Tracked"
          icon={CheckSquare}
          delta="All tasks"
          deltaType="neutral"
          color="blue"
        />
      </div>

      {/* Section 3 + 4 — Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Section 3 — Recent Activity */}
        <div className="lg:col-span-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-800">
              Recent Activity (Mock)
            </h2>
            <button className="text-sm font-medium text-[#1D9E75] hover:text-[#0f6e56] hover:underline transition-colors">
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5 group">
                <div
                  className={`w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0 ${item.dot} group-hover:scale-125 transition-transform`}
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {item.name}
                    </span>{" "}
                    {item.action}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 — Pending Leave Requests */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-800">
              Leave Requests (Mock)
            </h2>
            <button className="text-sm font-medium text-[#1D9E75] hover:text-[#0f6e56] hover:underline transition-colors">
              See all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {leaveRequests.map((l, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 group">
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#1D9E75] transition-colors">{l.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {l.type} · {l.dates}
                  </p>
                </div>
                <span
                  className={`text-[11px] tracking-wide font-bold px-3 py-1.5 rounded-full capitalize shadow-sm ${statusStyle[l.status]}`}
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
