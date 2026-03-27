"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import FilterChips from "@/components/FilterChips";
import ResultsList from "@/components/ResultsList";
import type { SearchResult, FilterKey, Filters } from "@/types";

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    free: false,
    beginner: false,
    noSignup: false,
    aiPowered: false,
  });

  const performSearch = useCallback(
    async (query: string, activeFilters: Filters) => {
      setIsLoading(true);
      setHasSearched(true);
      setCurrentQuery(query);

      try {
        const response = await fetch("/api/find-tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, filters: activeFilters }),
        });

        const data = await response.json();

        if (response.ok) {
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleSearch(query: string) {
    performSearch(query, filters);
  }

  function handleFilterToggle(key: FilterKey) {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    if (currentQuery) {
      performSearch(currentQuery, newFilters);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6">
        <div
          className={`w-full flex flex-col items-center transition-all duration-500 ease-out ${
            hasSearched ? "pt-8 sm:pt-12" : "pt-24 sm:pt-32 lg:pt-40"
          }`}
        >
          <div className={`text-center mb-8 transition-all duration-500 ${hasSearched ? "mb-6" : "mb-10"}`}>
            <h1
              className={`font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-all duration-500 ${
                hasSearched ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl lg:text-6xl"
              }`}
            >
              <span className="text-indigo-600 dark:text-indigo-400">Use</span>This
              <span className="text-indigo-600 dark:text-indigo-400">.</span>Site
            </h1>
            <p
              className={`text-zinc-500 dark:text-zinc-400 mt-3 transition-all duration-500 ${
                hasSearched
                  ? "text-sm max-w-md"
                  : "text-base sm:text-lg max-w-lg"
              }`}
            >
              {hasSearched
                ? "Describe a task. Get the right tool."
                : "Stop googling \"best tool for X.\" Describe what you need, get the answer."}
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className={`mt-5 transition-all duration-500 ${hasSearched ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"}`}>
            <FilterChips filters={filters} onToggle={handleFilterToggle} />
          </div>
        </div>

        <div className={`w-full mt-8 pb-16 transition-all duration-500 ${hasSearched ? "opacity-100" : "opacity-0"}`}>
          <ResultsList
            results={results}
            isLoading={isLoading}
            hasSearched={hasSearched}
            query={currentQuery}
          />
        </div>
      </main>

      <footer className="py-6 text-center border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          UseThis.Site — Find the right tool for any task
        </p>
      </footer>
    </div>
  );
}
