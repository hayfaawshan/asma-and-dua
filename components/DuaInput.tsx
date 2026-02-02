"use client"

import { useEffect, useState } from "react"
type Props = {
    onSubmit: (dua: string) => void

}

export default function DuaInput({onSubmit}: Props) {
    const [dua, setDua] = useState("")

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
                    value={dua}
                    onChange={(e) => setDua(e.target.value)}
                    rows={6}
                    placeholder=""
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
                
                <button
                onClick={() => onSubmit(dua)}
                className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
                    Find the Names
                </button>

                <p className="text-cs text-gray-500">
                    This stays on your device.
                </p>
        </div>
    )
}