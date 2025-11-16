import { NextResponse } from "next/server";
import { fetchBitbucketRepos } from "@/lib/bitbucket";

export async function GET() {
  const repos = await fetchBitbucketRepos("GROWTH");
  return NextResponse.json({ repos });
}
