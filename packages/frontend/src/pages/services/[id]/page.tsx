
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, ArrowLeft, Clock } from "lucide-react"
import { Link } from "react-router-dom"

import { ProviderServicesClient } from "@/components/provider-services-client"

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ServiceDetailsPage({ params }: PageProps) {
    const { id } = await params

    // Fetch the clicked service with provider info
    const service = await prisma.service.findUnique({
        where: { id },
        include: { 
            provider: {
                include: {
                    servicesProvided: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }
        },
    })

    if (!service) {
        window.location.href = "/404"
    }

    const provider = service.provider

    const categoryColors: Record<string, string> = {
        "Laundry": "bg-cyan-300",
        "Grooming": "bg-pink-300",
        "Tech Support": "bg-purple-300",
        "Food Delivery": "bg-orange-300",
        "Coffee Run": "bg-lime-300",
        "Tutoring": "bg-yellow-300",
    }
    const categoryBg = categoryColors[service.category] || "bg-pink-300"

    return (
        <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
            {/* Back Button */}
            <div className="mb-6">
                <Link to="/services">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Services
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 w-1.5 h-full bg-black" />
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className={`text-base px-3 py-1 ${categoryBg}`}>
                                {service.category}
                            </Badge>
                            <Badge variant="secondary" className={`${
                                service.status === "Available"
                                    ? "bg-green-300 text-black"
                                    : "bg-yellow-300 text-black"
                            } text-base px-3 py-1`}>
                                {service.status}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                            {service.title}
                        </h1>
                        <div className="relative aspect-video w-full mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <img 
                                src={service.imageUrl || "https://furntech.org.za/wp-content/uploads/2017/05/placeholder-image.png"} 
                                alt={service.title} 
                                 
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-3 mb-6 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {service.price && (
                                <div className="text-2xl font-black flex items-center gap-2">
                                    <span className="bg-yellow-300 border-2 border-black px-3 py-1">{service.price}</span>
                                    <span className="text-sm font-bold text-muted-foreground ml-2">starting price</span>
                                </div>
                            )}
                            {service.operatingHours && (
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Clock className="h-4 w-4" />
                                    <span>{service.operatingHours}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Provider Info + Services */}
                <div className="md:col-span-2 space-y-8 min-w-0">
                    {/* Provider Header */}
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-4 border-black">
                                <AvatarImage src={provider.image || ""} alt={provider.name} />
                                <AvatarFallback className="bg-yellow-300 font-black text-xl">
                                    {provider.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                                <h2 className="text-2xl font-black mb-2">{provider.name}</h2>
                                
                                {provider.bio && (
                                    <p className="text-muted-foreground font-bold mb-3 text-sm">{provider.bio}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {provider.location && (
                                        <div className="flex items-center gap-1 font-bold">
                                            <MapPin className="h-4 w-4" />
                                            <span>{provider.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 font-bold">
                                        <span className="bg-green-300 border-2 border-black px-2 py-1 text-xs">
                                            {provider.servicesProvided.length} {provider.servicesProvided.length === 1 ? 'Service' : 'Services'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Services Section */}
                    <div>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <span className="bg-pink-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
                                ALL SERVICES
                            </span>
                        </h2>

                        <ProviderServicesClient 
                            services={provider.servicesProvided} 
                            providerId={provider.id} 
                            providerName={provider.name}
                            highlightedServiceId={service.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
