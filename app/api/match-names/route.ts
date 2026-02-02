import {NextResponse} from "next/server"
import { SYSTEM_PROMPT } from "@/lib/prompt"
import type { MatchNamesRequest, MatchNamesResponse } from "@/lib/types"

export async function POST(req: Request) {
    try {
        const body = (await req.json() as MatchNamesRequest)

        if (!body.dua || body.dua.trim().length === 0 ) {
            return NextResponse.json([], { status: 200})
        }

        // call ollama model
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                model: "llama3",
                prompt: `${SYSTEM_PROMPT}\nUser du'a:\n${body.dua}`,
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