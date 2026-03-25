import { Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function ServiceSearch() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const searchParamsString = searchParams.toString()
    const [text, setText] = useState(searchParams.get("q") || "")
    const [query] = useDebounce(text, 300)

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString)
        if (query) {
            params.set("q", query)
        } else {
            params.delete("q")
        }
        navigate(`/services?${params.toString()}`)
    }, [query, searchParamsString])

    return (
        <div className="relative w-full max-w-md my-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
            <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-4 border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] font-bold text-black focus:outline-none focus:ring-0 placeholder:text-black/40 bg-white"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    )
}
