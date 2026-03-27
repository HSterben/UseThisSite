import type { Tool, SearchResult, Filters } from "@/types";
import toolsData from "@/data/tools.json";

const tools: Tool[] = toolsData as Tool[];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "what", "which", "who",
  "where", "when", "how", "can", "could", "would", "should", "do", "does",
  "did", "i", "me", "my", "we", "our", "you", "your", "it", "its",
  "that", "this", "to", "for", "of", "in", "on", "at", "by", "with",
  "from", "and", "or", "but", "not", "no", "so", "if", "then",
  "good", "best", "great", "nice", "website", "site", "tool", "app",
  "online", "use", "need", "want", "looking", "find", "help", "make",
  "something", "some", "any", "get", "have", "has", "been", "be",
  "there", "here", "just", "also", "very", "really", "thing", "things",
  "like", "one", "way", "using", "used",
]);

function getSearchTokens(text: string): string[] {
  return tokenize(text).filter((t) => !STOP_WORDS.has(t) && t.length > 1);
}

type Scoring = { score: number; matchCount: number; reasons: string[] };

function detectIntentTokens(searchTokens: string[]): string[] {
  const set = new Set(searchTokens);

  const isGame = set.has("game") || set.has("gamedev") || set.has("unity") || set.has("unreal");
  const is3d = set.has("3d") || set.has("model") || set.has("models") || set.has("mesh") || set.has("meshes");
  const isAssets = set.has("asset") || set.has("assets") || set.has("textures") || set.has("texture") || set.has("materials") || set.has("material");

  if (is3d && (isAssets || isGame)) {
    return ["3d-assets", "game-assets", "models", "textures", "asset-library"];
  }

  return [];
}

function scoreTool(tool: Tool, searchTokens: string[], rawQuery: string): Scoring {
  let score = 0;
  let matchCount = 0;
  const reasons: string[] = [];
  const normalizedQuery = normalize(rawQuery);
  const toolName = normalize(tool.name);
  const toolDesc = normalize(tool.description);
  const toolTasks = tool.tasks.map(normalize);
  const toolCategories = tool.category.map(normalize);
  const toolTags = tool.tags.map(normalize);
  const intentTokens = detectIntentTokens(searchTokens);
  const strictAssetSearch = intentTokens.length > 0;

  for (const task of toolTasks) {
    if (normalizedQuery.includes(task) || task.includes(normalizedQuery)) {
      score += 25;
      matchCount += 2;
      reasons.push("direct task match");
    }
  }

  const allTokens = [...new Set([...searchTokens, ...intentTokens])];

  for (const token of allTokens) {
    for (const task of toolTasks) {
      if (task.includes(token)) {
        score += 8;
        matchCount += 1;
      }
    }
    for (const cat of toolCategories) {
      if (cat.includes(token) || token.includes(cat)) {
        score += 6;
        matchCount += 1;
      }
    }
    if (toolName.includes(token)) {
      score += 6;
      matchCount += 1;
    }
    if (toolDesc.includes(token)) {
      score += 2;
      matchCount += 1;
    }
    for (const tag of toolTags) {
      if (tag.includes(token) || token.includes(tag)) {
        score += 4;
        matchCount += 1;
      }
    }
  }

  // If the user is clearly searching for 3D/game assets, downrank non-asset tools hard.
  if (strictAssetSearch) {
    const assetCategories = new Set([
      "3d-assets",
      "game-assets",
      "2d-assets",
      "marketplace",
      "textures",
      "hdris",
      "stock-media",
      "images",
    ]);
    const isAssetTool =
      toolCategories.some((c) => assetCategories.has(c)) ||
      toolTags.some((t) => t.includes("asset") || t.includes("3d") || t.includes("pbr")) ||
      toolTasks.some((t) => t.includes("asset") || t.includes("3d"));

    if (!isAssetTool) {
      score -= 40;
    }
  }

  // Only apply the manual quality score if we had at least one real match.
  if (matchCount > 0) {
    score += tool.score * 0.5;
  }

  return { score, matchCount, reasons };
}

export function searchTools(
  query: string,
  filters: Filters,
  limit = 8
): SearchResult[] {
  const searchTokens = getSearchTokens(query);

  if (searchTokens.length === 0) {
    return [];
  }

  let filtered = tools;

  if (filters.free) {
    filtered = filtered.filter((t) => t.pricing === "free" || t.pricing === "freemium");
  }
  if (filters.beginner) {
    filtered = filtered.filter((t) => t.beginnerFriendly);
  }
  if (filters.noSignup) {
    filtered = filtered.filter((t) => t.noSignup);
  }
  if (filters.aiPowered) {
    filtered = filtered.filter((t) => t.aiPowered);
  }

  const scored = filtered
    .map((tool) => {
      const s = scoreTool(tool, searchTokens, query);
      return { tool, ...s };
    })
    // Require at least one meaningful match; prevents random high-score tools.
    .filter((item) => item.matchCount > 0 && item.score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ tool, score }) => ({
    tool,
    reason: "",
    relevance: Math.min(Math.round((score / (scored[0]?.score || 1)) * 100), 100),
  }));
}

export function getAllTools(): Tool[] {
  return tools;
}
