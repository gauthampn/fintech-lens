"use client";

import useSWR from "swr";
import { RepoCard } from "@/components/repo-card";
import { Filters } from "@/components/filters";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import type { Repo } from "@/types/repo";
import type { RelevanceFilter, SortBy } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function RepoCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 border border-[#e5e5e5] rounded-xl p-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function RepoGrid() {
  const [relevanceFilter, setRelevanceFilter] =
    useState<RelevanceFilter>("All");
  const [sortBy, setSortBy] = useState<SortBy>("stars");

  const { data: repos, error, isLoading } = useSWR<Repo[]>("/api/repos", fetcher);

  const filteredAndSortedRepos = useMemo(() => {
    if (!repos) return [];

    let filtered = repos;

    // Apply relevance filter
    if (relevanceFilter !== "All") {
      filtered = filtered.filter((repo) => repo.relevance === relevanceFilter);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      // Sort by activity (most recent first)
      return (
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );
    });

    return sorted;
  }, [repos, relevanceFilter, sortBy]);

  return (
    <div className="space-y-6">
      <Filters
        relevanceFilter={relevanceFilter}
        sortBy={sortBy}
        onRelevanceChange={setRelevanceFilter}
        onSortChange={setSortBy}
      />

      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Failed to load repositories. Please try again later.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Note: GitHub API has a rate limit of 60 requests per hour for
            unauthenticated requests.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredAndSortedRepos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No repositories found matching your filters.
          </p>
        </div>
      )}

      {!isLoading && !error && filteredAndSortedRepos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
