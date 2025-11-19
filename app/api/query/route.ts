import { NextRequest, NextResponse } from "next/server";
import { analyzeUserQuery, isGroqConfigured } from "@/lib/groq";
import { fetchRepositoryContext } from "@/lib/bitbucket";

export async function POST(request: NextRequest) {
  try {
    // Check if Groq is configured
    if (!isGroqConfigured()) {
      return NextResponse.json(
        {
          error: "Groq API is not configured. Please set GROQ_API_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { query, repository } = body;

    // Validate query
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Fetch repository context if repository is provided
    let repositoryContext;
    if (repository && typeof repository === "string") {
      const projectKey =
        process.env.NEXT_PUBLIC_BITBUCKET_PROJECT_KEY || "GROWTH";

      console.log(`Fetching repository context for: ${repository}`);
      repositoryContext = await fetchRepositoryContext(projectKey, repository);
      console.log(`Repository context fetched:`, {
        branch: repositoryContext.defaultBranch,
        filesCount: repositoryContext.structure.length,
        hasReadme: !!repositoryContext.readme,
        hasPackageJson: !!repositoryContext.packageJson,
      });
    }

    // Analyze the query using Groq AI with repository context
    const analysis = await analyzeUserQuery(query, repositoryContext);

    // Return the analysis
    return NextResponse.json({
      success: true,
      query,
      repository,
      analysis,
      repositoryContext: repositoryContext
        ? {
            branch: repositoryContext.defaultBranch,
            filesCount: repositoryContext.structure.length,
            hasReadme: !!repositoryContext.readme,
            hasPackageJson: !!repositoryContext.packageJson,
          }
        : undefined,
    });
  } catch (error) {
    console.error("Error in /api/query:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
