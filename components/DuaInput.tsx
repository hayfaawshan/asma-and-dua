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
      <p className="text-sm text-muted-foreground">
        Write your duʿāʾ in your own words.
      </p>

      <textarea
        ref={textareaRef}
        value={dua}
        onChange={(e) => setDua(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-border bg-input text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      <div className="flex gap-3">
        {/* Find button */}
        <button
          disabled={loading || dua.trim().length === 0}
          onClick={onSubmit}
          className="flex-1 btn-primary"
        >
          {buttonLabel}
        </button>

        {/* Clear button */}
        <button
          disabled={loading}
          onClick={onClear}
          className="btn-base px-4 py-2 text-sm"
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-muted-foreground">Your du&apos;a stays on your device, what you type won&apos;t be seen or saved.</p>
    </div>
  );
}