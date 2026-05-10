import type { Repo } from "@/types/repo";
import { getRelevance } from "@/lib/scoring";

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

const QUERIES: { q: string; per_page: number }[] = [
  { q: "topic:fintech+topic:llm+language:english", per_page: 10 },
  { q: "topic:fintech+topic:ai-agent+language:english", per_page: 10 },
  { q: "topic:payments+topic:langchain+language:english", per_page: 30 },
];

async function fetchQuery(q: string, per_page: number): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=${per_page}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "FinTech-Lens-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} for query ${q}`);
    return [];
  }

  const data: GitHubSearchResponse = await response.json();
  return data.items ?? [];
}

export async function fetchRepos(): Promise<Repo[]> {
  const results = await Promise.all(
    QUERIES.map(({ q, per_page }) => fetchQuery(q, per_page))
  );

  const allRepos = results.flat();

  const unique = Array.from(
    new Map(allRepos.map((r) => [r.id, r])).values()
  );

  const asciiOnly = (str: string) => /^[\x00-\x7F]*$/.test(str);
  const filtered = unique.filter(
    (r) => r.description !== null && r.description !== "" && asciiOnly(r.description)
  );

  return filtered.map((r) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description ?? "No description available",
    stargazers_count: r.stargazers_count,
    language: r.language,
    pushed_at: r.pushed_at,
    topics: r.topics,
    relevance: getRelevance(r.topics),
  }));
}
