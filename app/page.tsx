"use client";

import { useEffect, useState } from "react";
import type { BitbucketRepo } from "@/lib/bitbucket";

export default function Home() {
  const [repos, setRepos] = useState<BitbucketRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-6 p-8">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <select
            className="px-4 py-2 border border-zinc-300 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
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
