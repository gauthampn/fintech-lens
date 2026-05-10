"use client";

import { useState } from "react";
import { ExternalLink, Star, Sparkles, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Repo } from "@/types/repo";

interface RepoCardProps {
  repo: Repo;
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function isActive(pushedAt: string): boolean {
  const lastPush = new Date(pushedAt);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return lastPush >= ninetyDaysAgo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const active = isActive(repo.pushed_at);
  const [analyzing, setAnalyzing] = useState(false);

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  }

  return (
    <Card className="flex flex-col border-[#e5e5e5] py-4 shadow-none hover:border-[#d4d4d4] transition-colors">
      <CardHeader className="gap-2 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1.5"
            >
              <span className="text-muted-foreground font-normal">
                {repo.full_name.split("/")[0]}/
              </span>
              <span>{repo.name}</span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-[#fafafa] text-foreground border-[#e5e5e5] font-normal"
          >
            <Star className="size-3 fill-current" />
            {formatStars(repo.stargazers_count)}
          </Badge>
          {repo.language && (
            <Badge
              variant="outline"
              className="font-normal border-[#e5e5e5] text-muted-foreground"
            >
              {repo.language}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {/* Stars Badge */}
          <Badge
            variant="outline"
            className="text-xs font-normal border-[#e5e5e5] bg-[#fafafa]"
          >
            <span className="text-muted-foreground mr-1">Stars:</span>
            <span
              className={
                repo.stargazers_count >= 1000
                  ? "text-amber-700"
                  : "text-foreground"
              }
            >
              {repo.stargazers_count >= 10000
                ? "Very High"
                : repo.stargazers_count >= 1000
                ? "High"
                : "Moderate"}
            </span>
          </Badge>
          {/* Activity Badge */}
          <Badge
            variant="outline"
            className="text-xs font-normal border-[#e5e5e5] bg-[#fafafa]"
          >
            <span className="text-muted-foreground mr-1">Activity:</span>
            <span className={active ? "text-emerald-700" : "text-orange-700"}>
              {active ? "Active" : "Stale"}
            </span>
          </Badge>
          {/* Relevance Badge */}
          <Badge
            variant="outline"
            className="text-xs font-normal border-[#e5e5e5] bg-[#fafafa]"
          >
            <span className="text-muted-foreground mr-1">Relevance:</span>
            <span
              className={
                repo.relevance === "Both" ? "text-violet-700" : "text-sky-700"
              }
            >
              {repo.relevance}
            </span>
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          disabled={analyzing}
          onClick={handleAnalyze}
          className="w-full border-[#e5e5e5] text-muted-foreground hover:border-gray-400 transition-colors"
        >
          {analyzing ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" />
              Analyze with AI
              <span className="text-xs opacity-60 ml-1">(Sprint 2)</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
