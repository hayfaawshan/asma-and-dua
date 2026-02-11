"use client";

import { useEffect, useState } from "react";

import DuaInput from "@/components/DuaInput";
import Results from "@/components/Results";

import type { DivineNameResult } from "@/lib/types";

export default function Home() {
  const [dua, setDua] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("dua") ?? "";
  });

  const [currentResults, setCurrentResults] = useState<DivineNameResult[]>([]);
  const [previousResults, setPreviousResults] = useState<DivineNameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const [lastSubmittedDua, setLastSubmittedDua] = useState("");
  const [noMoreNames, setNoMoreNames] = useState(false);

  useEffect(() => {
    localStorage.setItem("dua", dua);
  }, [dua]);

  const isSameDua = dua.trim() !== "" && dua.trim() === lastSubmittedDua.trim();

  const buttonLabel =
    currentResults.length > 0 && isSameDua ? "Find more Names" : "Find the Names";

  function handleClear() {
    localStorage.removeItem("dua");
    setDua("");
    setCurrentResults([]);
    setPreviousResults([]);
    setLastSubmittedDua("");
    setNoMoreNames(false);
    setClearSignal((v) => v + 1);
  }

  async function handleSubmit() {
    const trimmed = dua.trim();
    if (!trimmed) return;

    const isSame = trimmed === lastSubmittedDua.trim();

    const exclude = isSame
      ? [...currentResults, ...previousResults].map((r) => r.transliteration)
      : [];

    setLoading(true);

    const res = await fetch("/api/match-names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dua: trimmed,
        exclude
      })
    });

    const data = await res.json();

    if (isSame) {
      if (Array.isArray(data) && data.length > 0) {
        setPreviousResults((prev) => [...currentResults, ...prev]);
        setCurrentResults(data);
        setNoMoreNames(false);
      } else {
        setNoMoreNames(true);
      }
    } else {
      setCurrentResults(Array.isArray(data) ? data : []);
      setPreviousResults([]);
      setNoMoreNames(false);
    }

    setLastSubmittedDua(trimmed);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-6">
      <h1 className="text-3xl font-semibold">Asma & Duʿāʾ</h1>

      <DuaInput
        dua={dua}
        setDua={setDua}
        onSubmit={handleSubmit}
        onClear={handleClear}
        loading={loading}
        clearSignal={clearSignal}
        buttonLabel={buttonLabel}
      />

      <div className="w-full max-w-xl h-px bg-gray-800" />

      <Results
        currentResults={currentResults}
        previousResults={previousResults}
        loading={loading}
        noMoreNames={noMoreNames}
      />
    </main>
  );
}
