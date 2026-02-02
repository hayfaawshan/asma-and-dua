"use client";
import { useState } from "react";

import DuaInput from "@/components/DuaInput";
import Results from "@/components/Results"

import type { DivineNameResult } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<DivineNameResult[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(dua: string) {
    setLoading(true);
    setResults([])

    const res = await fetch("/api/match-names", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({dua})

    })

    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-6">
      <h1 className="text-3xl font-semibold">Asma & Duʿāʾ</h1>

      <DuaInput onSubmit={handleSubmit}/>
      <Results results={results} loading={loading}/>
    </main>
  )

}