import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption ? "text-gray-900 line-clamp-1 font-medium" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Search size={14} className="text-gray-400 ml-1" />
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none text-gray-900 bg-transparent placeholder-gray-400 py-1"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-center text-gray-500">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between transition-colors ${
                    opt.value === value
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="line-clamp-1">{opt.label}</span>
                  {opt.value === value && <Check size={16} className="text-gray-900 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
