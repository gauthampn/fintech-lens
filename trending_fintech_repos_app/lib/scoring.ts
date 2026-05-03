import type { Repo } from "@/types/repo";

export function getActivityBadge(pushed_at: string): "Active" | "Stale" {
  const daysSincePush =
    (Date.now() - new Date(pushed_at).getTime()) / (1000 * 60 * 60 * 24);
  return daysSincePush <= 90 ? "Active" : "Stale";
}

export function getStarBadge(stars: number): string {
  if (stars >= 10000) return "10k+";
  if (stars >= 1000) return `${Math.floor(stars / 1000)}k+`;
  if (stars >= 100) return "100+";
  return String(stars);
}

export function getRelevance(topics: string[]): Repo["relevance"] {
  const isFintech = topics.some((t) =>
    ["fintech", "payments", "banking", "finance"].includes(t)
  );
  const isAI = topics.some((t) =>
    ["llm", "ai-agent", "langchain", "openai", "claude", "rag"].includes(t)
  );
  if (isFintech && isAI) return "Both";
  if (isAI) return "Agentic AI";
  return "FinTech";
}
