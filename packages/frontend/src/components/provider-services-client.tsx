"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"

interface Service {
    id: string
    title: string
    description: string
    price: string
    category: string
    status: string
}

interface ProviderServicesClientProps {
    services: Service[]
    providerId: string
    providerName: string
    highlightedServiceId?: string
}

const categoryColors: Record<string, string> = {
    "Laundry": "bg-cyan-300",
    "Grooming": "bg-pink-300",
    "Tech Support": "bg-purple-300",
    "Food Delivery": "bg-orange-300",
    "Coffee Run": "bg-lime-300",
    "Tutoring": "bg-yellow-300",
}

export function ProviderServicesClient({ services, providerId, providerName, highlightedServiceId }: ProviderServicesClientProps) {
    const navigate = useNavigate()
    const { addItem, items } = useCartStore()
    const [bookingServiceId, setBookingServiceId] = useState<string | null>(null)

    const handleAddToCart = (service: Service) => {
        addItem({
            serviceId: service.id,
            serviceTitle: service.title,
            servicePrice: service.price,
            providerId,
            providerName,
        })
        
        toast.success("Added to cart!", {
            description: `${service.title} added to your cart`,
        })
    }

    const handleBookNow = (serviceId: string) => {
        setBookingServiceId(serviceId)
        navigate(`/book/${serviceId}`)
    }

    const getItemQuantity = (serviceId: string) => {
        const item = items.find(i => i.serviceId === serviceId)
        return item?.quantity || 0
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
                const categoryColor = categoryColors[service.category] || "bg-purple-200"
                const inCartQuantity = getItemQuantity(service.id)
                const isHighlighted = highlightedServiceId === service.id

                return (
                    <Card 
                        key={service.id} 
                        className={`border-4 border-black transition-all ${
                            isHighlighted 
                                ? "bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-yellow-400" 
                                : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <Badge variant="outline" className={`${categoryColor} border-black font-black`}>
                                    {service.category}
                                </Badge>
                                <Badge variant="outline" className={`${
                                    service.status === "Available"
                                        ? "bg-green-300 text-black"
                                        : "bg-yellow-300 text-black"
                                } border-black font-black`}>
                                    {service.status}
                                </Badge>
                            </div>
                            
                            <div className="flex items-start gap-2">
                                {isHighlighted && (
                                    <Badge className="bg-pink-500 text-white border-2 border-black font-black text-xs">
                                        VIEWING
                                    </Badge>
                                )}
                                <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground font-bold line-clamp-2 min-h-[2.5rem]">
                                {service.description}
                            </p>

                            {/* Price */}
                            <div className="text-2xl font-black">
                                <span className="bg-yellow-300 border-2 border-black px-3 py-1 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    {service.price}
                                </span>
                            </div>

                            {/* Cart Quantity Indicator */}
                            {inCartQuantity > 0 && (
                                <div className="bg-green-100 border-2 border-black px-3 py-2 text-sm font-bold">
                                    <span className="text-green-700">✓ {inCartQuantity} in cart</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleAddToCart(service)}
                                    variant="outline"
                                    className="flex-1 border-2 border-black font-black hover:bg-cyan-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    disabled={service.status !== "Available"}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    ADD TO CART
                                </Button>

                                <Button
                                    onClick={() => handleBookNow(service.id)}
                                    className="flex-1 bg-black text-white border-2 border-black font-black hover:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    disabled={service.status !== "Available" || bookingServiceId === service.id}
                                >
                                    BOOK NOW
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
