export const runtime = "edge";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ASMA_UL_HUSNA } from "@/lib/asma-ul-husna";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import type { DivineNameResult, MatchNamesRequest } from "@/lib/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log("Has GROQ key:", !!process.env.GROQ_API_KEY);

function normalizeName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\s*ya\s+/i, "")
    .replace(/[’'`]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();
}

function normalizeArabic(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^\u0621-\u064A]/g, "");
}

function stripArticlePrefix(value: string) {
  return value.replace(/^(al|ar|as|ash|at|ad|az|an|am|aq)/, "");
}

const officialByTransliteration = new Map(
  ASMA_UL_HUSNA.map((name) => [normalizeName(name.transliteration), name])
);

const officialByBaseTransliteration = new Map(
  ASMA_UL_HUSNA.map((name) => [
    stripArticlePrefix(normalizeName(name.transliteration)),
    name
  ])
);

const officialByArabic = new Map(
  ASMA_UL_HUSNA.map((name) => [normalizeArabic(name.arabic), name])
);

function resolveToOfficialName(candidate: Partial<DivineNameResult>) {
  if (!candidate) return null;

  if (candidate.transliteration) {
    const normalized = normalizeName(candidate.transliteration);

    const exact = officialByTransliteration.get(normalized);
    if (exact) return exact;

    const byBase = officialByBaseTransliteration.get(stripArticlePrefix(normalized));
    if (byBase) return byBase;
  }

  if (candidate.arabic) {
    const byArabic = officialByArabic.get(normalizeArabic(candidate.arabic));
    if (byArabic) return byArabic;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY");
    }

    const body = (await req.json()) as MatchNamesRequest;

    const dua = body.dua?.trim();
    const exclude = body.exclude ?? [];

    if (!dua) {
      return NextResponse.json([]);
    }

    const prompt = [
      `User du'a:\n${dua}`,
      exclude.length
        ? `Previously suggested Names (do not repeat):\n${exclude.join(", ")}`
        : ""
    ]
      .filter(Boolean)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    });

    const rawText = completion.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error("No model output received");
    }

    const match = rawText.match(/\[[\s\S]*\]/);

    if (!match) {
      throw new Error("Model did not return JSON");
    }

    const parsed = JSON.parse(match[0]);

    const excludedNormalized = new Set(exclude.map(normalizeName));
    const sanitized = (Array.isArray(parsed) ? parsed : [])
      .map((item) => {
        const official = resolveToOfficialName(item);
        if (!official) return null;
        if (excludedNormalized.has(normalizeName(official.transliteration))) return null;

        return {
          arabic: official.arabic,
          transliteration: official.transliteration,
          meaning: official.meaning,
          reason:
            typeof item.reason === "string" && item.reason.trim().length > 0
              ? item.reason.trim()
              : "This Name reflects your du'a intention."
        };
      })
      .filter((item): item is DivineNameResult => Boolean(item))
      .filter(
        (item, index, all) =>
          all.findIndex(
            (entry) =>
              normalizeName(entry.transliteration) ===
              normalizeName(item.transliteration)
          ) === index
      )
      .slice(0, 2);

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("match-names error:", error);
    return NextResponse.json(
      { error: "Failed to match Names" },
      { status: 500 }
    );
  }
}
