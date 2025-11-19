"use client";

import { useEffect, useState } from "react";
import type { BitbucketRepo } from "@/lib/bitbucket";
import { POPULAR_PROJECTS, UI_TEXT } from "./data";

export default function Home() {
  const [repos, setRepos] = useState<BitbucketRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BITBUCKET_BASE_URL ||
        "https://bitbucket.upstox.com";
      const token = process.env.NEXT_PUBLIC_BITBUCKET_TOKEN;

      if (!token) {
        setError("NEXT_PUBLIC_BITBUCKET_TOKEN not configured");
        setLoading(false);
        return;
      }

      const url = `${baseUrl}/rest/api/1.0/projects/GROWTH/repos?limit=100`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        const repoList = (data.values || []).map(
          (r: { id: number; slug: string; name: string; public: boolean }) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            public: r.public,
          })
        );
        setRepos(repoList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handlePillClick = (projectSlug: string) => {
    setSelectedRepo(projectSlug);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || analyzing) return;

    const userQuery = message;
    setMessage("");
    setAnalyzing(true);

    try {
      console.log("=== User Query Submitted ===");
      console.log("Query:", userQuery);
      console.log("Repository:", selectedRepo);

      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          repository: selectedRepo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze query");
      }

      const data = await response.json();

      console.log("=== Groq AI Analysis ===");
      console.log("Intent:", data.analysis.intent);
      console.log("Category:", data.analysis.category);
      console.log("Entities:", data.analysis.entities);
      console.log("Confidence:", data.analysis.confidence);
      console.log("Summary:", data.analysis.summary);

      if (data.repositoryContext) {
        console.log("\n=== Repository Context ===");
        console.log("Branch:", data.repositoryContext.branch);
        console.log("Files Count:", data.repositoryContext.filesCount);
        console.log("Has README:", data.repositoryContext.hasReadme);
        console.log("Has package.json:", data.repositoryContext.hasPackageJson);
      }

      console.log("========================");
    } catch (err) {
      console.error("Error analyzing query:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze query");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center apple-gradient-bg font-sans p-6 overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl animate-fade-in-scale">
        <div className="text-center space-y-3 mb-2">
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white bg-clip-text">
            Code Assistant
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
            Analyze and query your repositories with AI
          </p>
        </div>

        <div className="glass-panel p-10 rounded-3xl w-full flex flex-col gap-8 transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col gap-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Repository
            </label>
            <div className="relative group">
              <select
                className="glass-input w-full px-6 py-5 rounded-2xl outline-none text-zinc-800 dark:text-zinc-100 appearance-none cursor-pointer text-base font-medium hover:shadow-lg transition-all"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  {loading ? UI_TEXT.loading : repos.length ? UI_TEXT.selectPlaceholder : UI_TEXT.noRepos}
                </option>
                {repos
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((repo) => (
                    <option key={repo.slug} value={repo.slug}>
                      {repo.name}
                    </option>
                  ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              {UI_TEXT.popularLabel}
            </p>
            <div className="flex flex-wrap gap-3">
              {POPULAR_PROJECTS.map((project, index) => (
                <button
                  key={project}
                  onClick={() => handlePillClick(project)}
                  disabled={loading}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 animate-slide-in ${
                    selectedRepo === project
                      ? "glass-button-active shadow-xl scale-105"
                      : "glass-button hover:shadow-lg text-zinc-700 dark:text-zinc-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>

          {selectedRepo && (
            <div className="animate-fade-in-scale pt-2" style={{ animationDelay: '0.4s' }}>
              <form onSubmit={handleSendMessage} className="relative group">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={analyzing ? UI_TEXT.analyzingPlaceholder : UI_TEXT.askPlaceholder(selectedRepo)}
                    disabled={analyzing}
                    className="glass-input w-full pl-6 pr-16 py-5 rounded-2xl outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base font-medium shadow-sm group-hover:shadow-lg transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || analyzing}
                    className="absolute right-2 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    {analyzing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <div className="p-5 rounded-2xl bg-red-50/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium animate-fade-in-scale backdrop-blur-md shadow-lg">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Error</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
