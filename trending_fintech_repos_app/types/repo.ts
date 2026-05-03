export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
  relevance: "FinTech" | "Agentic AI" | "Both";
}
