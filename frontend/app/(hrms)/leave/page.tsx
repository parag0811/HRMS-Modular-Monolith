"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Table, { Column } from "@/components/common/Table";
import { Plus, Search, Loader2, AlertCircle, X } from "lucide-react";
import { GET_ALL_LEAVES } from "@/graphql/query/getLeaves";
import {
  CREATE_LEAVE,
  UPDATE_LEAVE,
  DELETE_LEAVE,
} from "@/graphql/mutation/leaveMutations";
import { GET_ALL_EMPLOYEES } from "@/graphql/query/getEmployees";
import SearchableSelect from "@/components/common/SearchableSelect";

// --- Types ---

interface LeaveItem {
  id: string;
  leaveId: string;
  employeeId: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  userId: string | null;
}

interface LeaveFormData {
  employeeId: string;
  clockIn: string;
  clockOut: string;
  status: string;
}

const statusOptions = ["Pending", "Approved", "Rejected"];

const defaultFormData: LeaveFormData = {
  employeeId: "",
  clockIn: new Date().toISOString().split("T")[0],
  clockOut: "",
  status: "Pending",
};

// --- Status Badge ---

const statusStyle: Record<string, string> = {
  Pending: "bg-[#FAEEDA] text-[#854F0B]",
  Approved: "bg-[#EAF3DE] text-[#3B6D11]",
  Rejected: "bg-[#FCEBEB] text-[#A32D2D]",
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyle[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${style}`}>
      {status}
    </span>
  );
}

// --- Helpers ---

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "—";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime()) || d.getFullYear() < 2000) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "—";
  }
}

// --- Modal ---

function LeaveModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  loading,
  employees,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: LeaveFormData;
  setFormData: (data: LeaveFormData) => void;
  isEdit: boolean;
  loading: boolean;
  employees: any[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isEdit ? "Edit Leave" : "Apply for Leave"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <SearchableSelect
              options={employees.map((e) => ({
                value: e.employeeId,
                label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
              }))}
              value={formData.employeeId}
              onChange={(val) => setFormData({ ...formData, employeeId: val })}
              placeholder="Select an employee"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.clockIn}
              onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formData.clockOut}
              onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !formData.employeeId.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Update" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Delete Confirmation Modal ---

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  itemName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Leave</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete leave for <strong>&quot;{itemName}&quot;</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function LeavePage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeaveItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<LeaveItem | null>(null);
  const [formData, setFormData] = useState<LeaveFormData>(defaultFormData);

  // --- GraphQL Query ---
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_LEAVES, {
    variables: {
      request: {
        pageCriteria: {
          enablePage: false,
          pageSize: 100,
          skip: 0,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: empData, loading: empLoading } = useQuery<any>(GET_ALL_EMPLOYEES, {
    variables: {
      request: {
        pageCriteria: { enablePage: false, pageSize: 1000, skip: 0 },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const employeeList = empData?.getAllEmployees?.data?.employees ?? [];

  // --- GraphQL Mutations ---
  const [createLeave, { loading: creating }] = useMutation(CREATE_LEAVE);
  const [updateLeave, { loading: updating }] = useMutation(UPDATE_LEAVE);
  const [deleteLeave, { loading: deleting }] = useMutation(DELETE_LEAVE);

  // --- Extract data ---
  const rawLeaves = data?.getAllLeaves?.data?.leaves ?? [];
  const leaves: LeaveItem[] = rawLeaves.map((l: Record<string, unknown>) => ({
    id: l.leaveId as string,
    leaveId: l.leaveId as string,
    employeeId: (l.employeeId as string) ?? "",
    clockIn: (l.clockIn as string) ?? "",
    clockOut: l.clockOut as string | null,
    status: (l.status as string) ?? "Pending",
    userId: l.userId as string | null,
  }));

  const filtered = leaves.filter((l) =>
    l.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: LeaveItem) => {
    setEditingItem(item);
    setFormData({
      employeeId: item.employeeId,
      clockIn: item.clockIn ? new Date(item.clockIn).toISOString().split("T")[0] : "",
      clockOut: item.clockOut ? new Date(item.clockOut).toISOString().split("T")[0] : "",
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateLeave({
          variables: {
            request: {
              requestParam: {
                leaveId: editingItem.leaveId,
                employeeId: formData.employeeId,
                clockIn: formData.clockIn ? new Date(formData.clockIn).toISOString() : new Date().toISOString(),
                clockOut: formData.clockOut ? new Date(formData.clockOut).toISOString() : null,
                status: formData.status,
              },
            },
          },
        });
      } else {
        await createLeave({
          variables: {
            request: {
              requestParam: {
                employeeId: formData.employeeId,
                clockIn: formData.clockIn ? new Date(formData.clockIn).toISOString() : new Date().toISOString(),
                clockOut: formData.clockOut ? new Date(formData.clockOut).toISOString() : null,
                status: formData.status,
              },
            },
          },
        });
      }
      setModalOpen(false);
      setFormData(defaultFormData);
      refetch();
    } catch (err) {
      console.error("Leave mutation error:", err);
    }
  };

  const handleOpenDelete = (item: LeaveItem) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteLeave({
        variables: {
          request: {
            requestParam: {
              leaveId: deletingItem.leaveId,
            },
          },
        },
      });
      setDeleteModalOpen(false);
      setDeletingItem(null);
      refetch();
    } catch (err) {
      console.error("Delete leave error:", err);
    }
  };

  // --- Action Buttons ---

  function ActionButtons({ item }: { item: LeaveItem }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleOpenEdit(item)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleOpenDelete(item)}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#F5C4B3] text-[#993C1D] hover:bg-[#FAECE7] transition-colors"
        >
          Delete
        </button>
      </div>
    );
  }

  // --- Columns ---

  const columns: Column<LeaveItem>[] = [
    { 
      header: "Employee", 
      accessor: (row) => {
        const emp = employeeList.find((e: any) => e.employeeId === row.employeeId);
        if (emp) {
          return (
            <div>
              <div className="font-medium text-gray-900">{`${emp.firstName} ${emp.lastName}`}</div>
              <div className="text-[11px] text-gray-500">{emp.employeeCode}</div>
            </div>
          );
        }
        return <span className="text-gray-500">{row.employeeId || "Unknown"}</span>;
      }
    },
    {
      header: "Start Date",
      accessor: (row) => <span className="text-xs text-gray-600">{formatDate(row.clockIn)}</span>,
      width: "110px",
    },
    {
      header: "End Date",
      accessor: (row) => <span className="text-xs text-gray-600">{formatDate(row.clockOut)}</span>,
      width: "110px",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      width: "120px",
    },
    {
      header: "Actions",
      accessor: (row) => <ActionButtons item={row} />,
      width: "160px",
    },
  ];

  // --- Render ---

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Leave Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Review and manage employee leave requests.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Apply Leave
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
        />
      </div>

      {/* Loading State */}
      {loading && leaves.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#1D9E75]" />
          <span className="ml-2 text-sm text-gray-500">Loading leave records...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm text-red-700">Failed to load leaves. Make sure the backend is running.</span>
        </div>
      )}

      {/* Table */}
      {!loading || leaves.length > 0 ? (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No leave requests found."
        />
      ) : null}

      {/* Create/Edit Modal */}
      <LeaveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!editingItem}
        loading={creating || updating}
        employees={employeeList}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deletingItem?.employeeId ?? ""}
      />
    </div>
  );
}
