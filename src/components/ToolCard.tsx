"use client";

import type { SearchResult } from "@/types";

interface ToolCardProps {
  result: SearchResult;
  index: number;
}

function PricingBadge({ pricing }: { pricing: string }) {
  const config: Record<string, { label: string; className: string; hoverText?: string }> = {
    free: {
      label: "Free",
      className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      hoverText: "Completely free to use.",
    },
    freemium: {
      label: "Freemium",
      className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      hoverText: "Free plan available with paid upgrades.",
    },
    paid: {
      label: "Paid",
      className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    "free-trial": {
      label: "Free Trial",
      className: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      hoverText: "Offers a free trial to get started.",
    },
  };

  const { label, className, hoverText } = config[pricing] || config.freemium;

  return (
    <span
      title={hoverText}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
}

export default function ToolCard({ result, index }: ToolCardProps) {
  const { tool, reason, relevance } = result;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800
        bg-white dark:bg-zinc-900
        hover:border-indigo-300 dark:hover:border-indigo-700
        hover:shadow-lg hover:shadow-indigo-500/5
        transition-all duration-200
        p-5 sm:p-6"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg
              bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400
              text-sm font-bold shrink-0">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100
              group-hover:text-indigo-600 dark:group-hover:text-indigo-400
              transition-colors truncate">
              {tool.name}
            </h3>
            <PricingBadge pricing={tool.pricing} />
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
            {reason || tool.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {tool.beginnerFriendly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
                🎯 Beginner
              </span>
            )}
            {tool.noSignup && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
                🔓 No Signup
              </span>
            )}
            {tool.aiPowered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
                ✨ AI
              </span>
            )}
            {tool.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md
                  bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {relevance > 0 && (
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {relevance}% match
            </div>
          )}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center
            text-zinc-400 group-hover:text-indigo-500
            bg-zinc-50 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950
            transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}
