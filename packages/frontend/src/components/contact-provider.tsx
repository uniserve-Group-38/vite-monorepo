
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

interface ContactProviderProps {
    phoneNumber: string | null
    location: string | null
}

export function ContactProvider({ phoneNumber, location }: ContactProviderProps) {
    const [isRevealed, setIsRevealed] = useState(false)

    if (!phoneNumber && !location) {
        return null
    }

    return (
        <div className="pt-4 space-y-4">
            {!isRevealed ? (
                <Button
                    className="w-full text-lg py-6 bg-cyan-300 text-black hover:bg-cyan-400"
                    size="lg"
                    onClick={() => setIsRevealed(true)}
                >
                    Contact Provider
                </Button>
            ) : (
                <div className="space-y-3 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-sm font-black uppercase text-muted-foreground mb-2">Contact Details</div>
                    {phoneNumber && (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-pink-300 border-2 border-black flex items-center justify-center">
                                <Phone className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-muted-foreground">Phone</div>
                                <a href={`tel:${phoneNumber}`} className="text-lg font-black hover:underline">
                                    {phoneNumber}
                                </a>
                            </div>
                        </div>
                    )}

                    {location && (
                        <div className="flex items-center gap-3 pt-2">
                            <div className="h-8 w-8 bg-lime-300 border-2 border-black flex items-center justify-center">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-muted-foreground">Location</div>
                                <div className="font-black">{location}</div>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setIsRevealed(false)}
                    >
                        Hide Details
                    </Button>
                </div>
            )}
        </div>
    )
}
