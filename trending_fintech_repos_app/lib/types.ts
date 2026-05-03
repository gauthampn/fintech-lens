export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  pushed_at: string;
  topics: string[];
  relevance: "FinTech" | "Agentic AI" | "Both";
}

export type RelevanceFilter = "All" | "FinTech" | "Agentic AI" | "Both";
export type SortBy = "stars" | "activity";
