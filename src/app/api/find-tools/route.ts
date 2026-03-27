import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/search";
import { enhanceResultsWithAI } from "@/lib/ai";
import type { Filters } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body as {
      query: string;
      filters?: Partial<Filters>;
    };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a search query." },
        { status: 400 }
      );
    }

    if (query.trim().length > 500) {
      return NextResponse.json(
        { error: "Query is too long. Keep it under 500 characters." },
        { status: 400 }
      );
    }

    const activeFilters: Filters = {
      free: filters?.free ?? false,
      beginner: filters?.beginner ?? false,
      noSignup: filters?.noSignup ?? false,
      aiPowered: filters?.aiPowered ?? false,
    };

    const results = searchTools(query.trim(), activeFilters);
    const enhanced = await enhanceResultsWithAI(query.trim(), results);

    return NextResponse.json({ results: enhanced });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
