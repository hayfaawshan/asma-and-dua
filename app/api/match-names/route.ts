import {NextResponse} from "next/server"
import { SYSTEM_PROMPT } from "@/lib/prompt"
import type { MatchNamesRequest, MatchNamesResponse } from "@/lib/types"

export async function POST(req: Request) {
    try {
        const body = (await req.json() as MatchNamesRequest)
        const dua = body.dua?.trim() ?? "";
        const exclude = body.exclude ?? []

        if (!dua) {
            return NextResponse.json([], { status: 200})
        }

        
        const prompt = [
            SYSTEM_PROMPT,
            `User du'a:\n${dua}`,
            exclude.length
              ? `Previously suggested Names (do not repeat):\n${exclude.join(", ")}`
              : ""
          ].filter(Boolean).join("\n\n");
          
        // call ollama model
    const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                model: "llama3",
                prompt,
                stream: false
            })
        })

        const data = await response.json()
        console.log("OLLAMA RAW RESPONSE:", data);
        const parsed: MatchNamesResponse = JSON.parse(data.response)

        return NextResponse.json(parsed)
    } catch (error) {
        console.error("match-names error:", error)
        return NextResponse.json([], {status: 500})
    }
}