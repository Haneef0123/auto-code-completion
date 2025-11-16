import { fetchBitbucketRepos } from "@/lib/bitbucket";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Force dynamic rendering since we perform a no-store fetch
export const dynamic = "force-dynamic";

export default async function Home() {
  const repos = await fetchBitbucketRepos("GROWTH");

  const options = repos
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => ({ label: r.name, value: r.slug }));

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex w-full max-w-2xl flex-col gap-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Repository Selector</CardTitle>
            <CardDescription>
              Pick a Bitbucket repository from the project key GROWTH.
            </CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <Label htmlFor="repo-select">Repository</Label>
            <Select
              options={options}
              placeholder={
                repos.length ? "Select a repository" : "No repositories found"
              }
              className="w-full"
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
