import { NextResponse } from "next/server";
import type { Repo } from "@/lib/types";

const FINTECH_TOPICS = ["fintech", "finance", "payments", "banking", "trading"];
const AGENTIC_AI_TOPICS = [
  "llm",
  "ai-agent",
  "langchain",
  "agent",
  "openai",
  "gpt",
  "autonomous-agents",
  "ai-agents",
];

function determineRelevance(
  topics: string[]
): "FinTech" | "Agentic AI" | "Both" {
  const lowerTopics = topics.map((t) => t.toLowerCase());
  const hasFintech = lowerTopics.some((t) => FINTECH_TOPICS.includes(t));
  const hasAgenticAI = lowerTopics.some((t) => AGENTIC_AI_TOPICS.includes(t));

  if (hasFintech && hasAgenticAI) return "Both";
  if (hasFintech) return "FinTech";
  return "Agentic AI";
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

async function fetchGitHubRepos(query: string): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc&per_page=20`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "FinTech-Lens-App",
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status}`);
    return [];
  }

  const data: GitHubSearchResponse = await response.json();
  return data.items || [];
}

export async function GET() {
  try {
    // Fetch repos from multiple queries in parallel
    const queries = [
      "topic:fintech topic:llm",
      "topic:fintech topic:ai-agent",
      "topic:payments topic:langchain",
    ];

    const results = await Promise.all(queries.map(fetchGitHubRepos));
    const allRepos = results.flat();

    // Deduplicate by repo ID
    const uniqueRepos = Array.from(
      new Map(allRepos.map((repo) => [repo.id, repo])).values()
    );

    // Transform to our Repo interface
    const repos: Repo[] = uniqueRepos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description || "No description available",
      stargazers_count: repo.stargazers_count,
      language: repo.language || "Unknown",
      pushed_at: repo.pushed_at,
      topics: repo.topics,
      relevance: determineRelevance(repo.topics),
    }));

    // Sort by stars and take top 10
    const sortedRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);

    return NextResponse.json(sortedRepos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
