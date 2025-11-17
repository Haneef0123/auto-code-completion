"use client";

import { useEffect, useState } from "react";
import type { BitbucketRepo } from "@/lib/bitbucket";

export default function Home() {
  const [repos, setRepos] = useState<BitbucketRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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

  const popularProjects = ["ui-stock-details", "ui-wp-pages", "ui-landing-pages"];

  const handlePillClick = (projectSlug: string) => {
    setSelectedRepo(projectSlug);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Handle message sending here
    console.log("Sending message:", message, "for repo:", selectedRepo);
    setMessage("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-6 p-8">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <select
            className="px-4 py-2 border border-zinc-300 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              {loading
                ? "Loading repositories..."
                : repos.length
                ? "Select a repository"
                : "No repositories found"}
            </option>
            {repos
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((repo) => (
                <option key={repo.slug} value={repo.slug}>
                  {repo.name}
                </option>
              ))}
          </select>

          {/* Popular Projects Pills */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Popular projects:</p>
            <div className="flex flex-wrap gap-2">
              {popularProjects.map((project) => (
                <button
                  key={project}
                  onClick={() => handlePillClick(project)}
                  disabled={loading}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedRepo === project
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Bar - appears when repo is selected */}
          {selectedRepo && (
            <div className="animate-fadeIn">
              <form onSubmit={handleSendMessage} className="relative">
                <div className="flex items-center gap-2 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Ask about ${selectedRepo}...`}
                    className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-zinc-600 dark:text-zinc-300"
                    >
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
