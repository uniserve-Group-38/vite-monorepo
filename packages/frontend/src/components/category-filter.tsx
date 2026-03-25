
"use client"

import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
    categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const navigate = useNavigate()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category")

    const handleSelect = (category: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category) {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        navigate(`/services?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide pt-2">
            <button
                onClick={() => handleSelect(null)}
                className={cn(
                    "px-6 py-2 border-2 border-black font-black uppercase tracking-widest text-sm transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1",
                    currentCategory === null
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-slate-50"
                )}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleSelect(category)}
                    className={cn(
                        "px-6 py-2 border-2 border-black font-black uppercase tracking-widest text-sm transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 whitespace-nowrap",
                        currentCategory === category
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-slate-50"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
