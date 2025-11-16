export interface BitbucketRepo {
  id: number;
  slug: string;
  name: string;
  public: boolean;
}

export async function fetchBitbucketRepos(
  projectKey: string
): Promise<BitbucketRepo[]> {
  const baseUrl =
    process.env.BITBUCKET_BASE_URL || "https://bitbucket.upstox.com";
  const token = process.env.BITBUCKET_TOKEN;

  if (!token) {
    console.warn("BITBUCKET_TOKEN is not set in environment variables");
    return [];
  }

  const url = `${baseUrl}/rest/api/1.0/projects/${projectKey}/repos?limit=100`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Bitbucket fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return (data.values || []).map((r: any) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      public: r.public,
    }));
  } catch (error) {
    console.error("Error fetching Bitbucket repos:", error);
    return [];
  }
}
