"use client";

import type { SearchResult } from "@/types";
import ToolCard from "./ToolCard";

interface ResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
  query: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-5 w-32 rounded-md bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-md bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-5 w-20 rounded-md bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsList({ results, isLoading, hasSearched, query }: ResultsListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!hasSearched) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 px-4 max-w-md mx-auto">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          No tools found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Try describing your task differently. For example, instead of &quot;{query}&quot;, 
          try being more specific about what you want to accomplish.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Found <span className="font-semibold text-zinc-700 dark:text-zinc-300">{results.length}</span> tools
          {query && (
            <>
              {" "}for <span className="font-semibold text-zinc-700 dark:text-zinc-300">&quot;{query}&quot;</span>
            </>
          )}
        </p>
      </div>
      <div className="space-y-3">
        {results.map((result, index) => (
          <ToolCard key={result.tool.id} result={result} index={index} />
        ))}
      </div>
    </div>
  );
}
