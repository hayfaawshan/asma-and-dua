"use client";

import { useEffect, useRef } from "react";

type Props = {
  dua: string;
  setDua: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  loading: boolean;
  clearSignal: number;
  buttonLabel: string;
};

export default function DuaInput({
  dua,
  setDua,
  onSubmit,
  onClear,
  loading,
  clearSignal,
  buttonLabel
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Clear + refocus
  useEffect(() => {
    setDua("");
    textareaRef.current?.focus();
  }, [clearSignal, setDua]);

  return (
    <div className="w-full max-w-xl space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Write your duʿāʾ in your own words.
      </p>

      <textarea
        ref={textareaRef}
        value={dua}
        onChange={(e) => setDua(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      <div className="flex gap-3">
        {/* Find button */}
        <button
          disabled={loading || dua.trim().length === 0}
          onClick={onSubmit}
          className="
            flex-1 rounded-lg
            bg-gradient-to-r from-slate-800 to-slate-700
            px-4 py-2 text-white
            hover:from-slate-700 hover:to-slate-600
            transition
            shadow-md
            disabled:opacity-50
          "
        >
          {buttonLabel}
        </button>

        {/* Clear button */}
        <button
          disabled={loading}
          onClick={onClear}
          className="
            rounded-lg
            border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)]
            hover:bg-[var(--control-hover-bg)]
            transition
            disabled:opacity-50
          "
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">Your du'a stays on your device, what you type won't be seen or saved.</p>
    </div>
  );
}
