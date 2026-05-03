"use client";

import { cn } from "@/lib/utils";
import type { RelevanceFilter, SortBy } from "@/lib/types";

interface FiltersProps {
  relevanceFilter: RelevanceFilter;
  sortBy: SortBy;
  onRelevanceChange: (filter: RelevanceFilter) => void;
  onSortChange: (sort: SortBy) => void;
}

const relevanceOptions: RelevanceFilter[] = [
  "All",
  "FinTech",
  "Agentic AI",
  "Both",
];
const sortOptions: { value: SortBy; label: string }[] = [
  { value: "stars", label: "Stars" },
  { value: "activity", label: "Recent Activity" },
];

export function Filters({
  relevanceFilter,
  sortBy,
  onRelevanceChange,
  onSortChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      {/* Relevance Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {relevanceOptions.map((option) => (
          <button
            key={option}
            onClick={() => onRelevanceChange(option)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full border transition-colors",
              relevanceFilter === option
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-[#e5e5e5] hover:border-[#d4d4d4] hover:text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Sort Pills */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <div className="flex items-center gap-1.5">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-colors",
                sortBy === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-[#e5e5e5] hover:border-[#d4d4d4] hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
