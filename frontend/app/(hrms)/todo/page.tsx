"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Table, { Column } from "@/components/common/Table";
import { Plus, Search, Loader2, AlertCircle, X } from "lucide-react";
import { GET_ALL_TODOS } from "@/graphql/query/getTodos";
import { CREATE_TODO, UPDATE_TODO, DELETE_TODO } from "@/graphql/mutation/todoMutations";

// --- Types ---

interface TodoItem {
  id: string;
  todoId: string;
  title: string;
  description: string;
  dueDate: string | null;
  isCompleted: boolean;
  userId: string | null;
}

interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

const defaultFormData: TodoFormData = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().split("T")[0],
  isCompleted: false,
};

// --- Status Badge ---

function StatusBadge({ isCompleted }: { isCompleted: boolean }) {
  const status = isCompleted ? "Completed" : "Pending";
  const style = isCompleted
    ? "bg-[#EAF3DE] text-[#3B6D11]"
    : "bg-[#FAEEDA] text-[#854F0B]";
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${style}`}>
      {status}
    </span>
  );
}

// --- Modal ---

function TodoModal({
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
  formData: TodoFormData;
  setFormData: (data: TodoFormData) => void;
  isEdit: boolean;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isEdit ? "Edit Todo" : "Add New Todo"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
              placeholder="Enter todo title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition resize-none"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCompleted"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#1D9E75] focus:ring-[#1D9E75]"
            />
            <label htmlFor="isCompleted" className="text-sm text-gray-700">Mark as completed</label>
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
            disabled={loading || !formData.title.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Update" : "Create"}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Todo</h2>
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

export default function TodoPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<TodoItem | null>(null);
  const [formData, setFormData] = useState<TodoFormData>(defaultFormData);

  // --- GraphQL Query ---
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_TODOS, {
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
  const [createTodo, { loading: creating }] = useMutation(CREATE_TODO);
  const [updateTodo, { loading: updating }] = useMutation(UPDATE_TODO);
  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO);

  // --- Extract data ---
  const rawTodos = data?.getAllTodos?.data?.todos ?? [];
  const todos: TodoItem[] = rawTodos.map((t: Record<string, unknown>) => ({
    id: t.todoId as string,
    todoId: t.todoId as string,
    title: (t.title as string) ?? "",
    description: (t.description as string) ?? "",
    dueDate: t.dueDate as string | null,
    isCompleted: (t.isCompleted as boolean) ?? false,
    userId: t.userId as string | null,
  }));

  const filtered = todos.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setFormData(defaultFormData);
    setModalOpen(true);
  };

  const handleOpenEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "",
      isCompleted: todo.isCompleted,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingTodo) {
        await updateTodo({
          variables: {
            request: {
              requestParam: {
                todoId: editingTodo.todoId,
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                isCompleted: formData.isCompleted,
              },
            },
          },
        });
      } else {
        await createTodo({
          variables: {
            request: {
              requestParam: {
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                isCompleted: formData.isCompleted,
              },
            },
          },
        });
      }
      setModalOpen(false);
      setFormData(defaultFormData);
      refetch();
    } catch (err) {
      console.error("Todo mutation error:", err);
    }
  };

  const handleOpenDelete = (todo: TodoItem) => {
    setDeletingTodo(todo);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTodo) return;
    try {
      await deleteTodo({
        variables: {
          request: {
            requestParam: {
              todoId: deletingTodo.todoId,
            },
          },
        },
      });
      setDeleteModalOpen(false);
      setDeletingTodo(null);
      refetch();
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  // --- Action Buttons ---

  function ActionButtons({ todo }: { todo: TodoItem }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleOpenEdit(todo)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleOpenDelete(todo)}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#F5C4B3] text-[#993C1D] hover:bg-[#FAECE7] transition-colors"
        >
          Delete
        </button>
      </div>
    );
  }

  // --- Columns ---

  const columns: Column<TodoItem>[] = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Description",
      accessor: (row) => (
        <span className="text-gray-500 text-xs line-clamp-1">
          {row.description || "—"}
        </span>
      ),
    },
    {
      header: "Due Date",
      accessor: (row) => (
        <span className="text-xs text-gray-600">
          {row.dueDate
            ? new Date(row.dueDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "—"}
        </span>
      ),
      width: "120px",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge isCompleted={row.isCompleted} />,
      width: "140px",
    },
    {
      header: "Actions",
      accessor: (row) => <ActionButtons todo={row} />,
      width: "160px",
    },
  ];

  // --- Render ---

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Todo Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage employee tasks and reminders.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Todo
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] focus:border-[#1D9E75] transition"
        />
      </div>

      {/* Loading State */}
      {loading && todos.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#1D9E75]" />
          <span className="ml-2 text-sm text-gray-500">Loading todos...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm text-red-700">Failed to load todos. Make sure the backend is running.</span>
        </div>
      )}

      {/* Table */}
      {!loading || todos.length > 0 ? (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No todos found. Add your first one."
        />
      ) : null}

      {/* Create/Edit Modal */}
      <TodoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={!!editingTodo}
        loading={creating || updating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deletingTodo?.title ?? ""}
      />

    </div>
  );
}