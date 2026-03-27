import type { SearchResult } from "@/types";

const openRouterKey = process.env.OPENROUTER_API_KEY || "";
const openRouterModel =
  process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it:free";

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export async function enhanceResultsWithAI(
  query: string,
  results: SearchResult[]
): Promise<SearchResult[]> {
  if (!openRouterKey || results.length === 0) {
    return results.map((r) => ({
      ...r,
      reason: generateFallbackReason(query, r),
    }));
  }

  try {
    const toolList = results
      .map(
        (r, i) =>
          `${i + 1}. ${r.tool.name} — ${r.tool.description} (pricing: ${r.tool.pricing})`
      )
      .join("\n");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        // Optional (nice-to-have) headers per OpenRouter recommendations
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_NAME || "UseThis.Site",
      },
      body: JSON.stringify({
        model: openRouterModel,
        temperature: 0.3,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You help match web tools to user needs. Given a user query and a list of tools, write a short 1-sentence reason for each tool explaining why it fits the user's need. Be specific and practical. Return ONLY a JSON array of strings, one reason per tool, in the same order.",
          },
          {
            role: "user",
            content: `User query: "${query}"\n\nTools:\n${toolList}\n\nReturn a JSON array of ${results.length} short reasons.`,
          },
        ],
      }),
    });

    const json = (await res.json()) as OpenRouterResponse;
    const content = json.choices?.[0]?.message?.content?.trim() || "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const reasons: string[] = JSON.parse(jsonMatch[0]);
      return results.map((r, i) => ({
        ...r,
        reason: reasons[i] || generateFallbackReason(query, r),
      }));
    }
  } catch {
    // AI failed — fall back to generated reasons
  }

  return results.map((r) => ({
    ...r,
    reason: generateFallbackReason(query, r),
  }));
}

function generateFallbackReason(query: string, result: SearchResult): string {
  const tool = result.tool;
  const pricing =
    tool.pricing === "free"
      ? "Completely free to use."
      : tool.pricing === "freemium"
        ? "Free plan available with paid upgrades."
        : tool.pricing === "free-trial"
          ? "Offers a free trial to get started."
          : "Paid tool with professional features.";

  const beginner = tool.beginnerFriendly
    ? " Great for beginners."
    : " Better suited for experienced users.";

  const noSignup = tool.noSignup ? " No account needed to start." : "";

  return `${tool.description.split(".")[0]}.${noSignup}${beginner} ${pricing}`;
}
