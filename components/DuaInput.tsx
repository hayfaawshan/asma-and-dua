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
      <p className="text-sm text-gray-600">
        Write your duʿāʾ in your own words. There is no right or wrong way.
      </p>

      <textarea
        ref={textareaRef}
        value={dua}
        onChange={(e) => setDua(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <div className="flex gap-3">
        <button
          disabled={loading || dua.trim().length === 0}
          onClick={onSubmit}
          className="flex-1 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {buttonLabel}
        </button>

        <button
          disabled={loading}
          onClick={onClear}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-gray-500">This stays on your device.</p>
    </div>
  );
}
