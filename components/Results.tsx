"use client";

import { useState } from "react";
import type { DivineNameResult } from "@/lib/types";
import MoonLoader from "@/components/SparkleLoader";

type Props = {
  currentResults: DivineNameResult[];
  previousResults: DivineNameResult[];
  loading: boolean;
  noMoreNames: boolean;
};

export default function Results({
  currentResults,
  previousResults,
  loading,
  noMoreNames
}: Props) {
  const [showPrevious, setShowPrevious] = useState(false);

  const safeCurrent = Array.isArray(currentResults) ? currentResults : [];
  const safePrevious = Array.isArray(previousResults) ? previousResults : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-3 py-6">
        <MoonLoader />
        <p className="text-sm text-gray-600 text-center">Finding the best matching Name...</p>
      </div>
    );
  }

  if (safeCurrent.length === 0 && !noMoreNames) return null;

  return (
    <div className="w-full max-w-xl space-y-6">
      {safeCurrent.map((item, index) => (
        <div
          key={`current-${index}`}
          className="rounded-lg border border-gray-200 p-4"
        >
          <h3 className="text-xl font-semibold">{item.arabic}</h3>
          <p className="italic">{item.transliteration}</p>
          <p className="text-sm text-gray-600">{item.meaning}</p>
          <p className="mt-2 text-sm">{item.reason}</p>
        </div>
      ))}

      {noMoreNames && (
        <div className="rounded-lg border border-gray-700 p-4 text-sm text-gray-300">
          No additional distinct Name was found for this same du&apos;a. Try adding more detail to your intention and search again.
        </div>
      )}

      {safePrevious.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowPrevious((v) => !v)}
            className="text-sm text-gray-400 underline"
          >
            {showPrevious ? "Hide previous Names" : "Show previous Names"}
          </button>

          {showPrevious && (
            <div className="space-y-4">
              {safePrevious.map((item, index) => (
                <div
                  key={`prev-${index}`}
                  className="rounded-lg border border-gray-800 p-4 opacity-80"
                >
                  <h3 className="text-lg font-semibold">{item.arabic}</h3>
                  <p className="italic">{item.transliteration}</p>
                  <p className="text-sm text-gray-600">{item.meaning}</p>
                  <p className="mt-2 text-sm">{item.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-gray-600">Call upon Allah with these Names in your duʿāʾ.</p>
    </div>
  );
}
