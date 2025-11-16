export interface BitbucketRepo {
  id: number;
  slug: string;
  name: string;
  public: boolean;
}

interface CacheEntry {
  data: BitbucketRepo[];
  expires: number;
}

interface RawRepo {
  id: number;
  slug: string;
  name: string;
  public: boolean;
}

interface BitbucketResponse {
  values?: RawRepo[];
}

const repoCache: Map<string, CacheEntry> = new Map();
const pendingRequests: Map<string, Promise<BitbucketRepo[]>> = new Map();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null) {
    const anyErr = err as { code?: string; cause?: { code?: string } };
    return anyErr.code || anyErr.cause?.code;
  }
  return undefined;
}

function isRetryableError(err: unknown): boolean {
  const code = getErrorCode(err);
  return (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ENOTFOUND" ||
    code === "EAI_AGAIN"
  );
}

function parseRepos(raw: BitbucketResponse): BitbucketRepo[] {
  if (!raw.values) return [];
  return raw.values.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    public: r.public,
  }));
}

/**
 * Fetch repositories from Bitbucket (Server/Data Center) with:
 * - Configurable timeout & retries
 * - Simple in-memory cache (warm function reuse) to reduce repeated calls
 * - Dedupe: concurrent calls for same projectKey reuse the same promise
 *
 * Environment variables:
 * BITBUCKET_BASE_URL (default https://bitbucket.upstox.com)
 * BITBUCKET_TOKEN (required)
 * BITBUCKET_REQUEST_TIMEOUT_MS (default 10000)
 * BITBUCKET_RETRIES (default 2) -> total attempts = retries + 1
 * BITBUCKET_BACKOFF_MS (default 500) -> exponential base backoff
 * BITBUCKET_CACHE_TTL_MS (default 300000 = 5 min)
 * BITBUCKET_ENABLE_CACHE (default 'true')
 */
export async function fetchBitbucketRepos(
  projectKey: string
): Promise<BitbucketRepo[]> {
  const baseUrl =
    process.env.BITBUCKET_BASE_URL || "https://bitbucket.upstox.com";
  const token = process.env.BITBUCKET_TOKEN;
  const timeoutMs = Number(process.env.BITBUCKET_REQUEST_TIMEOUT_MS || 10000);
  const retries = Number(process.env.BITBUCKET_RETRIES || 2);
  const backoffMs = Number(process.env.BITBUCKET_BACKOFF_MS || 500);
  const cacheTtlMs = Number(process.env.BITBUCKET_CACHE_TTL_MS || 300_000);
  const cacheEnabled =
    (process.env.BITBUCKET_ENABLE_CACHE || "true") === "true";

  if (!token) {
    console.warn("BITBUCKET_TOKEN is not set; returning empty repo list.");
    return [];
  }

  const cacheKey = projectKey;
  const now = Date.now();
  if (cacheEnabled) {
    const cached = repoCache.get(cacheKey);
    if (cached && cached.expires > now) {
      return cached.data;
    }
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!; // Dedupe concurrent calls
  }

  const url = `${baseUrl}/rest/api/1.0/projects/${projectKey}/repos?limit=100`;

  const requestPromise = (async (): Promise<BitbucketRepo[]> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
          // For non-2xx, don't retry unless it's a 5xx and attempts remain
          const shouldRetry = res.status >= 500 && attempt < retries;
          if (shouldRetry) {
            const delay =
              backoffMs * Math.pow(2, attempt) + Math.random() * 100;
            console.warn(
              `Bitbucket response ${
                res.status
              }. Retrying in ${delay}ms (attempt ${attempt + 1}/${retries}).`
            );
            await sleep(delay);
            continue;
          }
          console.error(
            `Bitbucket fetch failed: ${res.status} ${res.statusText}`
          );
          return [];
        }

        const json: BitbucketResponse = await res.json();
        const repos = parseRepos(json);
        if (cacheEnabled) {
          repoCache.set(cacheKey, {
            data: repos,
            expires: Date.now() + cacheTtlMs,
          });
        }
        return repos;
      } catch (err: unknown) {
        clearTimeout(timeout);
        const aborted = err instanceof Error && err.name === "AbortError";
        const retryable =
          !aborted && isRetryableError(err) && attempt < retries;
        if (retryable) {
          const delay = backoffMs * Math.pow(2, attempt) + Math.random() * 100;
          console.warn(
            `Bitbucket request error (${
              getErrorCode(err) ||
              (err instanceof Error ? err.message : String(err))
            }). Retrying in ${delay}ms (attempt ${attempt + 1}/${retries}).`
          );
          await sleep(delay);
          continue;
        }
        // Final failure or non-retryable
        console.error("Error fetching Bitbucket repos:", {
          message: err instanceof Error ? err.message : String(err),
          code: getErrorCode(err),
          attempt,
          aborted,
          retryable,
          url,
        });
        return [];
      }
    }
    return [];
  })();

  pendingRequests.set(cacheKey, requestPromise);
  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}
