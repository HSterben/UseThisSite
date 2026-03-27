export interface Tool {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string[];
  tasks: string[];
  pricing: "free" | "freemium" | "paid" | "free-trial";
  tags: string[];
  beginnerFriendly: boolean;
  noSignup: boolean;
  aiPowered: boolean;
  score: number;
}

export interface SearchResult {
  tool: Tool;
  reason: string;
  relevance: number;
}

export interface ParsedIntent {
  taskType: string;
  category: string;
  keywords: string[];
  intent: string;
}

export type FilterKey = "free" | "beginner" | "noSignup" | "aiPowered";

export interface Filters {
  free: boolean;
  beginner: boolean;
  noSignup: boolean;
  aiPowered: boolean;
}
