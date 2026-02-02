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
        Write your duʿāʾ in your own words.
      </p>

      <textarea
        ref={textareaRef}
        value={dua}
        onChange={(e) => setDua(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-gray-300 bg-black/20 p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />

      <div className="flex gap-3">
        {/* Find button */}
        <button
          disabled={loading || dua.trim().length === 0}
          onClick={onSubmit}
          className="
            flex-1 rounded-lg
            bg-gradient-to-r from-gray-800 to-gray-700
            px-4 py-2 text-white
            hover:from-gray-700 hover:to-gray-600
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
            border border-gray-500
            px-4 py-2 text-sm text-gray-300
            hover:bg-gray-800
            transition
            disabled:opacity-50
          "
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-gray-500">This stays on your device.</p>
    </div>
  );
}
