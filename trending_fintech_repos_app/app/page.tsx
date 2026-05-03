import { RepoGrid } from "@/components/repo-grid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-foreground flex items-center justify-center">
              <svg
                className="size-5 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
              FinTech Lens
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl text-pretty">
            Discover top trending open-source repositories at the intersection
            of FinTech and Agentic AI. Ranked by stars, activity, and topic
            relevance.
          </p>
        </header>

        {/* Repo Grid with Filters */}
        <RepoGrid />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#e5e5e5]">
          <p className="text-xs text-muted-foreground text-center">
            Data fetched from GitHub Search API. Limited to 60 requests per hour
            without authentication.
          </p>
        </footer>
      </div>
    </main>
  );
}
