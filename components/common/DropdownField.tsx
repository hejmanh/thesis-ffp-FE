"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  id?: string;
  name?: string;
  searchable?: boolean;
}

export default function DropdownField({
  options,
  placeholder = "Select...",
  value,
  onChange,
  className,
  buttonClassName,
  id,
  name,
  searchable = false,
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filteredOptions = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open, searchable]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {id && <input type="hidden" id={id} name={name || id} value={value || ""} />}
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex h-9 w-full items-center justify-between rounded-full border border-gray-300 bg-white px-3 text-sm leading-tight text-slate-700 outline-none transition focus-visible:ring-2 focus-visible:ring-ring hover:bg-gray-50",
          buttonClassName
        )}
      >
        {selected ? selected.label : placeholder}

        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5">
          {searchable && (
            <div className="border-b border-gray-200 p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded px-2 py-1 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}