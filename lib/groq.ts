import Groq from "groq-sdk";
import type { RepositoryContext } from "@/lib/bitbucket";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Interface for query analysis response
export interface QueryAnalysis {
  intent: string;
  entities: string[];
  category: string;
  confidence: number;
  summary: string;
}

/**
 * Analyzes user query using Groq AI to understand intent and extract information
 * @param query - The user's input query
 * @param repositoryContext - Optional repository context with structure and files
 * @returns QueryAnalysis object with interpreted intent
 */
export async function analyzeUserQuery(
  query: string,
  repositoryContext?: RepositoryContext
): Promise<QueryAnalysis> {
  try {
    // Build context information for the AI
    let contextInfo = "";

    if (repositoryContext) {
      contextInfo = `\n\nRepository Context for "${repositoryContext.slug}":
- Default Branch: ${repositoryContext.defaultBranch}
- Repository Structure (root files/folders):
${repositoryContext.structure
  .slice(0, 20)
  .map((item) => `  - ${item.type === "DIRECTORY" ? "📁" : "📄"} ${item.path.name}`)
  .join("\n")}
${repositoryContext.structure.length > 20 ? `  ... and ${repositoryContext.structure.length - 20} more items` : ""}
`;

      if (repositoryContext.packageJson) {
        const pkg = repositoryContext.packageJson as {
          name?: string;
          description?: string;
          dependencies?: Record<string, string>;
        };
        contextInfo += `\nPackage Info:
- Name: ${pkg.name || "N/A"}
- Description: ${pkg.description || "N/A"}
- Key Dependencies: ${pkg.dependencies ? Object.keys(pkg.dependencies).slice(0, 10).join(", ") : "N/A"}
`;
      }

      if (repositoryContext.readme) {
        // Include first 500 chars of README
        const readmeSnippet = repositoryContext.readme.slice(0, 500);
        contextInfo += `\nREADME excerpt:\n${readmeSnippet}${repositoryContext.readme.length > 500 ? "..." : ""}`;
      }
    }

    const systemPrompt = `You are an AI assistant that analyzes user queries about code repositories.
Your task is to understand the user's intent and extract key information based on the actual repository structure and content.

Respond with a JSON object containing:
- intent: A clear description of what the user wants to do
- entities: Array of key entities mentioned (files, functions, concepts, etc.)
- category: One of: "search", "explanation", "modification", "analysis", "documentation", "other"
- confidence: A number between 0 and 1 indicating confidence in the analysis
- summary: A brief one-sentence summary of the query
${contextInfo}`;

    const userPrompt = `Analyze this query: "${query}"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from Groq AI");
    }

    const analysis: QueryAnalysis = JSON.parse(responseContent);

    // Log the analysis for debugging
    console.log("Query Analysis:", {
      originalQuery: query,
      repository: repositoryContext?.slug,
      analysis,
    });

    return analysis;
  } catch (error) {
    console.error("Error analyzing query with Groq:", error);

    // Return a fallback analysis
    return {
      intent: "Unable to analyze query",
      entities: [],
      category: "other",
      confidence: 0,
      summary: query,
    };
  }
}

/**
 * Validates that Groq API is properly configured
 * @returns boolean indicating if Groq is ready to use
 */
export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}
