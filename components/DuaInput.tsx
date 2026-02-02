"use client"

import { useEffect, useState, useRef } from "react"

type Props = {
    onSubmit: (dua: string) => void
    onClear: () => void
    loading: boolean
    clearSignal: number
}

export default function DuaInput({onSubmit, onClear, loading, clearSignal}: Props) {
    const [dua, setDua] = useState("")

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    useEffect(() => {
        setDua("")
        textareaRef.current?.focus()
    }, [clearSignal])
    
    // Load saved duas
    useEffect(() => {
        const saved = localStorage.getItem("dua")
        if (saved) setDua(saved)
    }, [])

    // Save on change
    useEffect(() => {
        localStorage.setItem("dua", dua)
    }, [dua])

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
                    placeholder=""
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
          
                    
        <div className="flex gap-3">
            <button
                disabled={loading}
                onClick={() => onSubmit(dua)}
                className="flex-1 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
                Find the Names
            </button>

            <button
                disabled={loading}
                onClick={onClear}
                className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
                  Clear
            </button>
        </div>


                <p className="text-cs text-gray-500">
                    This stays on your device.
                </p>
        </div>
    )
}