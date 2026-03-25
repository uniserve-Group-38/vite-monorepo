
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight, Check, MapPin } from "lucide-react"

interface ServiceCardProps {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    imageUrl?: string | null
    index?: number
    provider: {
        name: string
        image: string | null
        location: string | null
    }
}

const categoryColors: Record<string, string> = {
    "Laundry": "bg-cyan-300",
    "Grooming": "bg-pink-300",
    "Tech Support": "bg-purple-300",
    "Food Delivery": "bg-orange-300",
    "Coffee Run": "bg-lime-300",
    "Tutoring": "bg-yellow-300",
}

export function ServiceCard({ id, title, description, category, status, price, imageUrl, provider, index = 0 }: ServiceCardProps) {
    const categoryBg = categoryColors[category] || "bg-pink-300"

    // Alternating rotation based on index: odd index rotates anticlockwise (-15deg), even index rotates clockwise (10deg)
    const rotationClass = index !== undefined && index % 2 === 0
        ? "hover:rotate-[10deg]"
        : "hover:rotate-[-10deg]";

    return (
        <article className={`group relative border-[4px] border-black bg-white shadow-[8px_8px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all duration-300 transform-gpu overflow-hidden flex flex-col h-full ${rotationClass}`}>

            {/* Front Side: Default View (Hidden on hover) */}
            <div className="flex flex-col h-full transition-opacity duration-300 group-hover:opacity-0">
                {/* Header with image - Now Rectangular */}
                <div className="relative aspect-[16/9] w-full border-b-[4px] border-black bg-slate-50 overflow-hidden">
                    <img 
                        src={imageUrl || "https://furntech.org.za/wp-content/uploads/2017/05/placeholder-image.png"}
                        alt={title}
                        
                        className="object-cover"
                    />

                    {/* Tilted Verified Badge Overlay */}
                    <div className="absolute top-3 right-3 bg-[#86efac] border-[3px] border-black px-3 py-1 shadow-[4px_4px_0_0_#000] flex items-center gap-1.5 -rotate-2 z-10">
                        <Check className="w-4 h-4 text-black stroke-[4px]" />
                        <span className="text-xs font-black uppercase tracking-tight text-black">Verified</span>
                    </div>
                </div>

                {/* Content Body */}
                <CardContent className={`${categoryBg} p-5 flex-grow flex flex-col gap-3`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                        {category}
                    </span>

                    <h3 className="text-xl font-black uppercase leading-tight tracking-tight text-black line-clamp-2">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-1">
                        {/* Rating Box */}
                        <div className="bg-yellow-400 border-[2px] border-black px-2 py-0.5 flex items-center gap-1.5 shadow-[2px_2px_0_0_#000]">
                            <Star className="w-3.5 h-3.5 fill-black text-black" />
                            <span className="font-black text-xs">4.6</span>
                        </div>

                        {/* Price */}
                        <div className="text-xl font-black tracking-tighter text-black">
                            {price || "FREE"}
                        </div>
                    </div>
                </CardContent>

                {/* Footer */}
                <div className="bg-black py-3 border-t-[3px] border-black flex items-center justify-center">
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                        View Details →
                    </span>
                </div>
            </div>

            {/* Back Side: Details View (Shown on hover) */}
            <div className="absolute inset-0 bg-black text-white p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between z-20">
                <div>
                    <h4 className="text-lg font-black uppercase mb-2 border-b-2 border-white pb-1 inline-block">
                        Description
                    </h4>
                    <p className="text-sm font-bold leading-relaxed line-clamp-4 opacity-90">
                        {description}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="bg-white/10 p-3 border-2 border-white/10">
                        <p className="text-[8px] uppercase font-black tracking-widest text-white/50 mb-1">Provider</p>
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 border-[2px] border-white overflow-hidden">
                                <img 
                                    src={provider.image || "/placeholder-avatar.png"}
                                    alt={provider.name}
                                    
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-black uppercase text-sm leading-tight">{provider.name}</p>
                                {provider.location && (
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-white/60 mt-0.5">
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span>{provider.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link to={`/services/${id}`} className="block">
                        <div className="bg-white text-black py-2 flex items-center justify-center gap-2 border-[3px] border-white hover:bg-black hover:text-white transition-all w-full">
                            <span className="text-[10px] font-black uppercase tracking-wider">
                                Book Now →
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </article>
    )
}
