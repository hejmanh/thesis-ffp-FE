"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useTranslations } from "@/i18n/client";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  id?: string;
  name?: string;
  searchable?: boolean;
}

export default function DropdownField({
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
  className,
  buttonClassName,
  id,
  name,
  searchable = false,
}: DropdownFieldProps) {
  const common = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLButtonElement[]>([]);

  const selected = options.find((o) => o.value === value);
  const filteredOptions = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleSelect = useCallback((selectedValue: string) => {
    onChange?.(selectedValue);
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  }, [onChange]);

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

    function handleKeyDown(event: KeyboardEvent) {
      if (!open) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          setOpen(false);
          setSearch("");
          buttonRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [filteredOptions, handleSelect, highlightedIndex, open]);

  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex].scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {id && <input type="hidden" id={id} name={name || id} value={value || ""} />}
      {/* Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (disabled) {
            return;
          }
          setOpen((currentOpen) => !currentOpen);
          setHighlightedIndex(-1);
          if (open) {
            setSearch("");
          }
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id ? `${id}-listbox` : undefined}
        className={cn(
          "inline-flex h-9 w-full items-center justify-between rounded-full border border-gray-300 bg-white px-3 text-sm leading-tight text-slate-700 outline-none transition focus-visible:ring-2 focus-visible:ring-ring hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          buttonClassName
        )}
      >
        {selected ? selected.label : placeholder ?? common("select")}

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
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute top-full left-0 right-0 z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5"
        >
          {searchable && (
            <div className="border-b border-gray-200 p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={common("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded px-2 py-1 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={common("search")}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${option.label}`}
                  ref={(el) => {
                    if (el) optionsRef.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "block w-full px-4 py-2 text-left text-sm transition",
                    value === option.value
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700",
                    highlightedIndex === index ? "bg-gray-100" : "hover:bg-gray-100"
                  )}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">{common("noResults")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
