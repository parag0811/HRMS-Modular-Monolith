"use client";

import { ReactNode } from "react";
import { Loader2, Inbox } from "lucide-react";

// --- Types ---

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
}

// --- Component ---

export default function Table<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = "No records found.",
  loading = false,
}: TableProps<T>) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{ width: col.width }}
                  className="px-6 py-3 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Loader2 size={24} className="animate-spin text-gray-900 mb-2" />
                    <span className="text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Inbox size={32} strokeWidth={1.5} className="mb-3 text-gray-300" />
                    <span className="text-sm font-medium text-gray-900">{emptyMessage}</span>
                    <span className="text-xs text-gray-500 mt-1">Get started by creating a new record.</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-gray-700 align-middle whitespace-nowrap"
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
