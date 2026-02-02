import type { DivineNameResult } from "@/lib/types";

type Props = {
    results: DivineNameResult[];
    loading: boolean
}

export default function Results({results, loading}: Props) {
    if (loading) {
        return <p className="text-sm text-gray-600">Finding relevant Names...</p>
    }

    if (results.length === 0) return null 

    return (
        <div className="w-full max-w-xl space-y-6">
            {results.map((item, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <h3 className="text-xl font-semibold">{item.arabic}</h3>
                    <p className="italic">{item.transliteration}</p>
                    <p className="mt-2 text-sm">{item.reason}</p>
                </div>
            ))}
        </div>
    )
}