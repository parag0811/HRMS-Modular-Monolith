"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Table, { Column } from "@/components/common/Table";
import { Plus, Search, Loader2, AlertCircle, X, ShieldAlert } from "lucide-react";
import { GET_ALL_EMPLOYEES } from "@/graphql/query/getEmployees";
import {
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from "@/graphql/mutation/employeeMutations";
import { useRole } from "@/context/RoleContext";

// --- Types ---

interface EmployeeItem {
  id: string;
  employeeId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  roleId: string;
  managerId: string | null;
  dateOfJoining: string | null;
  status: string;
  userId: string | null;
}

interface EmployeeFormData {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  roleId: string;
  managerId: string;
  dateOfJoining: string;
  status: string;
}

const statusOptions = ["Active", "Inactive", "OnLeave"];

const defaultFormData: EmployeeFormData = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  departmentId: "",
  roleId: "",
  managerId: "",
  dateOfJoining: new Date().toISOString().split("T")[0],
  status: "Active",
};

// --- Status Badge ---

const statusStyle: Record<string, string> = {
  Active: "bg-[#EAF3DE] text-[#3B6D11]",
  Inactive: "bg-[#FCEBEB] text-[#A32D2D]",
  OnLeave: "bg-[#FAEEDA] text-[#854F0B]",
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
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// --- Modal ---

function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: EmployeeFormData;
  setFormData: (data: EmployeeFormData) => void;
  isEdit: boolean;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
            <input
              type="text"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
              placeholder="e.g. EMP001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
            <input
              type="text"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role ID</label>
            <input
              type="text"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager ID</label>
            <input
              type="text"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
            <input
              type="date"
              value={formData.dateOfJoining}
              onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
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
            disabled={loading || !formData.firstName.trim() || !formData.lastName.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Update" : "Save"}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Employee</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <strong>&quot;{itemName}&quot;</strong>? This action cannot be undone.
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

export default function EmployeePage() {
  const { role } = useRole();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<EmployeeItem | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(defaultFormData);

  // --- GraphQL Query ---
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_EMPLOYEES, {
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

  // --- GraphQL Mutations ---
  const [createEmployee, { loading: creating }] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee, { loading: updating }] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee, { loading: deleting }] = useMutation(DELETE_EMPLOYEE);

  // --- Extract data ---
  const rawEmployees = data?.getAllEmployees?.data?.employees ?? [];
  const employees: EmployeeItem[] = rawEmployees.map((e: Record<string, unknown>) => ({
    id: e.employeeId as string,
    employeeId: e.employeeId as string,
    employeeCode: (e.employeeCode as string) ?? "",
    firstName: (e.firstName as string) ?? "",
    lastName: (e.lastName as string) ?? "",
    email: (e.email as string) ?? "",
    phone: (e.phone as string) ?? "",
    departmentId: (e.departmentId as string) ?? "",
    roleId: (e.roleId as string) ?? "",
    managerId: e.managerId as string | null,
    dateOfJoining: e.dateOfJoining as string | null,
    status: (e.status as string) ?? "Active",
    userId: e.userId as string | null,
  }));

  const filtered = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(search.toLowerCase()) ||
      e.lastName.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: EmployeeItem) => {
    setEditingItem(item);
    setFormData({
      employeeCode: item.employeeCode,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      departmentId: item.departmentId,
      roleId: item.roleId,
      managerId: item.managerId ?? "",
      dateOfJoining: item.dateOfJoining ? new Date(item.dateOfJoining).toISOString().split("T")[0] : "",
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId,
        roleId: formData.roleId,
        managerId: formData.managerId || null,
        dateOfJoining: formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString() : null,
        status: formData.status,
      };

      if (editingItem) {
        await updateEmployee({
          variables: {
            request: {
              requestParam: {
                employeeId: editingItem.employeeId,
                ...payload,
              },
            },
          },
        });
      } else {
        await createEmployee({
          variables: {
            request: {
              requestParam: {
                ...payload,
              },
            },
          },
        });
      }
      setModalOpen(false);
      setFormData(defaultFormData);
      refetch();
    } catch (err) {
      console.error("Employee mutation error:", err);
    }
  };

  const handleOpenDelete = (item: EmployeeItem) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteEmployee({
        variables: {
          request: {
            requestParam: {
              employeeId: deletingItem.employeeId,
            },
          },
        },
      });
      setDeleteModalOpen(false);
      setDeletingItem(null);
      refetch();
    } catch (err) {
      console.error("Delete employee error:", err);
    }
  };

  // --- Action Buttons ---

  function ActionButtons({ item }: { item: EmployeeItem }) {
    const isRestricted = role !== "HR";
    return (
      <div className="flex items-center gap-2" title={isRestricted ? "HR Permission Required" : ""}>
        <button
          onClick={() => handleOpenEdit(item)}
          disabled={isRestricted}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={() => handleOpenDelete(item)}
          disabled={isRestricted}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#F5C4B3] text-[#993C1D] hover:bg-[#FAECE7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    );
  }

  // --- Columns ---

  const columns: Column<EmployeeItem>[] = [
    { header: "Code", accessor: "employeeCode", width: "100px" },
    {
      header: "Name",
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900">{`${row.firstName} ${row.lastName}`}</div>
          <div className="text-[11px] text-gray-500">{row.email}</div>
        </div>
      ),
    },
    { header: "Phone", accessor: "phone" },
    { header: "Dept", accessor: "departmentId", width: "100px" },
    { header: "Role", accessor: "roleId", width: "100px" },
    {
      header: "Joined",
      accessor: (row) => <span className="text-xs text-gray-600">{formatDate(row.dateOfJoining)}</span>,
      width: "120px",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      width: "100px",
    },
    {
      header: "Actions",
      accessor: (row) => <ActionButtons item={row} />,
      width: "140px",
    },
  ];

  // --- Render ---

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your organization's employees and their details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role !== "HR" && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
              <ShieldAlert size={14} />
              Read Only
            </div>
          )}
          <button
            onClick={handleOpenCreate}
            disabled={role !== "HR"}
            title={role !== "HR" ? "HR Permission Required" : ""}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 shadow-sm text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Add Employee
          </button>
        </div>
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
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
        />
      </div>

      {/* Loading State */}
      {loading && employees.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-900" />
          <span className="ml-2 text-sm text-gray-500">Loading employees...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm text-red-700">Failed to load employees. Make sure the backend is running.</span>
        </div>
      )}

      {/* Table */}
      {!loading || employees.length > 0 ? (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No employees found."
        />
      ) : null}

      {/* Create/Edit Modal */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!editingItem}
        loading={creating || updating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deletingItem ? `${deletingItem.firstName} ${deletingItem.lastName}` : ""}
      />
    </div>
  );
}
