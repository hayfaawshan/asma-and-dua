"use client";

import { useEffect, useState } from "react";

import DuaInput from "@/components/DuaInput";
import Results from "@/components/Results";

import type { DivineNameResult } from "@/lib/types";

function SunLucideIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonLucideIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
    </svg>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });
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

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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
      <div className="w-full max-w-xl flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Asma & Duʿāʾ</h1>
        <button
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--control-hover-bg)] transition"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <SunLucideIcon /> : <MoonLucideIcon />}
        </button>
      </div>

      <DuaInput
        dua={dua}
        setDua={setDua}
        onSubmit={handleSubmit}
        onClear={handleClear}
        loading={loading}
        clearSignal={clearSignal}
        buttonLabel={buttonLabel}
      />

      <div className="w-full max-w-xl h-px bg-[var(--border)]" />

      <Results
        currentResults={currentResults}
        previousResults={previousResults}
        loading={loading}
        noMoreNames={noMoreNames}
      />
    </main>
  );
}
