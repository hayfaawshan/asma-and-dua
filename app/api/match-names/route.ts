import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import type { MatchNamesRequest } from "@/lib/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
      SYSTEM_PROMPT,
      `User du'a:\n${dua}`,
      exclude.length
        ? `Previously suggested Names (do not repeat):\n${exclude.join(", ")}`
        : ""
    ]
      .filter(Boolean)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const rawText = completion.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error("No model output received");
    }

    // Extract JSON array safely
    const match = rawText.match(/\[[\s\S]*\]/);

    if (!match) {
      throw new Error("Model did not return JSON");
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("match-names error:", error);
    return NextResponse.json(
      { error: "Failed to match Names" },
      { status: 500 }
    );
  }
}
