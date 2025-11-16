import { fetchBitbucketRepos } from "@/lib/bitbucket";

export default async function Home() {
  const repos = await fetchBitbucketRepos("GROWTH");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-6 p-8">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <select
            className="px-4 py-2 border border-zinc-300 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              {repos.length ? "Select a repository" : "No repositories found"}
            </option>
            {repos
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((repo) => (
                <option key={repo.slug} value={repo.slug}>
                  {repo.name}
                </option>
              ))}
          </select>
        </div>
      </main>
    </div>
  );
}
