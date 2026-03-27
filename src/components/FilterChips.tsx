"use client";

import type { FilterKey, Filters } from "@/types";

interface FilterChipsProps {
  filters: Filters;
  onToggle: (key: FilterKey) => void;
}

const FILTER_OPTIONS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "free", label: "Free", icon: "💰" },
  { key: "beginner", label: "Beginner Friendly", icon: "🎯" },
  { key: "noSignup", label: "No Signup", icon: "🔓" },
  { key: "aiPowered", label: "AI Powered", icon: "✨" },
];

export default function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {FILTER_OPTIONS.map(({ key, label, icon }) => {
        const active = filters[key];
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
              border transition-all duration-200 cursor-pointer
              ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
              }
            `}
          >
            <span className="text-sm">{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
