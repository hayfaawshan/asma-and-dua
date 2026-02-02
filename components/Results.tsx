import { useState } from "react";
import type { DivineNameResult } from "@/lib/types";

type Props = {
  currentResults: DivineNameResult[];
  previousResults: DivineNameResult[];
  loading: boolean;
};

export default function Results({
  currentResults,
  previousResults,
  loading
}: Props) {
  const [showPrevious, setShowPrevious] = useState(false);

  if (loading) {
    return <p className="text-sm text-gray-600">Finding relevant Names...</p>;
  }

  if (currentResults.length === 0) return null;

  return (
    <div className="w-full max-w-xl space-y-6">

      {/* Newest Results */}
      {currentResults.map((item, index) => (
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

      {/* Previous Results */}
      {previousResults.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowPrevious(v => !v)}
            className="text-sm text-gray-400 underline"
          >
            {showPrevious ? "Hide previous Names" : "Show previous Names"}
          </button>

          {showPrevious && (
            <div className="space-y-4">
              {previousResults.map((item, index) => (
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

      <p className="text-sm text-gray-600">
        Call upon Allah with these Names in your duʿāʾ.
      </p>
    </div>
  );
}
