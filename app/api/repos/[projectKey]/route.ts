import { NextRequest, NextResponse } from "next/server";
import { fetchBitbucketRepos } from "@/lib/bitbucket";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectKey: string }> }
) {
  try {
    const { projectKey } = await params;

    if (!projectKey) {
      return NextResponse.json(
        { error: "Project key is required" },
        { status: 400 }
      );
    }

    // Use the existing server-side utility to fetch repos
    const repos = await fetchBitbucketRepos(projectKey);

    return NextResponse.json({ values: repos });
  } catch (error) {
    console.error("Error fetching Bitbucket repos:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("401") || errorMessage.includes("Unauthorized")
      ? 401
      : errorMessage.includes("404") || errorMessage.includes("Not Found")
      ? 404
      : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
