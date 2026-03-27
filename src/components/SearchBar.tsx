"use client";

import { useState, useRef, useEffect } from "react";

const EXAMPLE_QUERIES = [
  "What's a good website to make diagrams?",
  "I need a site to compress a PDF",
  "What can I use to learn Python?",
  "Where can I find free stock photos?",
  "I need to remove a background from an image",
  "What's a good tool to edit videos online?",
  "What website can help me build a resume?",
  "I need to translate a document",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function animate() {
      const current = EXAMPLE_QUERIES[currentIndex];

      if (!isDeleting) {
        charIndex++;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === current.length) {
          animationRef.current = setTimeout(() => {
            isDeleting = true;
            animate();
          }, 2500);
          return;
        }
        animationRef.current = setTimeout(animate, 45);
      } else {
        charIndex--;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % EXAMPLE_QUERIES.length;
          animationRef.current = setTimeout(animate, 400);
          return;
        }
        animationRef.current = setTimeout(animate, 25);
      }
    }

    animate();
    return () => clearTimeout(animationRef.current);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  }

  function handleExampleClick(example: string) {
    setQuery(example);
    onSearch(example);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-14 sm:h-16 pl-5 sm:pl-6 pr-14 sm:pr-16 rounded-2xl
              bg-white dark:bg-zinc-900
              border-2 border-zinc-200 dark:border-zinc-700
              text-base sm:text-lg text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
              transition-all duration-200
              shadow-sm hover:shadow-md focus:shadow-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl
              bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700
              text-white disabled:text-zinc-500
              flex items-center justify-center
              transition-all duration-200
              active:scale-95"
            aria-label="Search"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {["compress PDF", "make diagrams", "learn Python", "edit video", "free stock photos"].map(
          (example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 text-xs sm:text-sm rounded-full
                bg-zinc-100 dark:bg-zinc-800
                text-zinc-600 dark:text-zinc-400
                hover:bg-indigo-50 hover:text-indigo-600
                dark:hover:bg-indigo-950 dark:hover:text-indigo-400
                border border-zinc-200 dark:border-zinc-700
                hover:border-indigo-200 dark:hover:border-indigo-800
                transition-all duration-200 cursor-pointer"
              disabled={isLoading}
            >
              {example}
            </button>
          )
        )}
      </div>
    </div>
  );
}
