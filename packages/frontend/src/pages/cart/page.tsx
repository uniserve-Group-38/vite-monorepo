"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "@/lib/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function CartPage() {
    const navigate = useNavigate()
    const { items, updateQuantity, removeItem, clearCart } = useCartStore()
    const [isBooking, setIsBooking] = useState(false)

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.servicePrice.replace(/[^\d.]/g, '')) || 0
            return total + (price * item.quantity)
        }, 0)
    }

    const handleBookAll = async () => {
        if (items.length === 0) return

        setIsBooking(true)

        try {
            // Get current user
            const sessionResponse = await fetch(import.meta.env.VITE_API_URL + `/api/auth/get-session`)
            const sessionData = await sessionResponse.json()
            const currentUser = sessionData.user

            if (!currentUser) {
                toast.error("Please sign in to book services")
                navigate("/auth/sign-in")
                return
            }

            // Create bookings for each cart item
            const bookingPromises = items.flatMap((item) => {
                // Create one booking per quantity
                return Array.from({ length: item.quantity }, () => 
                    fetch(import.meta.env.VITE_API_URL + `/api/bookings`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            serviceId: item.serviceId,
                            providerId: item.providerId,
                            studentId: currentUser.id,
                        }),
                    })
                )
            })

            const results = await Promise.all(bookingPromises)
            const failedBookings = results.filter(r => !r.ok)

            if (failedBookings.length > 0) {
                toast.error(`Failed to create ${failedBookings.length} booking(s)`)
            } else {
                toast.success(`Successfully created ${results.length} booking(s)!`)
                clearCart()
                navigate("/bookings")
            }
        } catch (error) {
            console.error("Booking error:", error)
            toast.error("Failed to create bookings")
        } finally {
            setIsBooking(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container py-8 max-w-4xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-black bg-purple-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <ShoppingCart className="h-24 w-24 mb-6 text-muted-foreground" />
                    <h2 className="text-3xl font-black mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground font-bold mb-6">
                        Browse services and add them to your cart
                    </p>
                    <Link to="/services">
                        <Button className="bg-black text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-2">
                    <span className="bg-yellow-300 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
                        SHOPPING CART
                    </span>
                </h1>
                <p className="text-lg font-bold mt-4">
                    {items.length} {items.length === 1 ? 'service' : 'services'} • {items.reduce((sum, item) => sum + item.quantity, 0)} total items
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const price = parseFloat(item.servicePrice.replace(/[^\d.]/g, '')) || 0
                        const itemTotal = price * item.quantity

                        return (
                            <Card key={item.serviceId} className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-black text-lg mb-1">{item.serviceTitle}</h3>
                                            <p className="text-sm text-muted-foreground font-bold mb-3">
                                                Provider: {item.providerName}
                                            </p>
                                            
                                            <div className="flex items-center gap-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-2 border-black"
                                                        onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="font-black text-lg w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-2 border-black"
                                                        onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* Price */}
                                                <div className="font-black text-lg">
                                                    <span className="bg-yellow-300 border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                        GH₵ {itemTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="border-2 border-black font-bold"
                                            onClick={() => {
                                                removeItem(item.serviceId)
                                                toast.success("Removed from cart")
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                        <CardHeader className="bg-purple-100 border-b-4 border-black">
                            <CardTitle className="font-black">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between font-bold">
                                    <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                                    <span>GH₵ {calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t-4 border-black pt-4">
                                <div className="flex justify-between text-xl font-black mb-6">
                                    <span>Total:</span>
                                    <span className="bg-yellow-300 border-2 border-black px-3 py-1 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        GH₵ {calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleBookAll}
                                    disabled={isBooking}
                                    className="w-full bg-black text-white font-black text-lg py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {isBooking ? "BOOKING..." : "BOOK ALL SERVICES"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>

                                <p className="text-xs text-center text-muted-foreground font-bold mt-4">
                                    Payment will be requested after each service is completed
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
