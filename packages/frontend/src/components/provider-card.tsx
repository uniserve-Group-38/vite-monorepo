import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Package } from "lucide-react"

interface ProviderCardProps {
    id: string
    name: string
    bio: string | null
    location: string | null
    image: string | null
    serviceCount: number
    categories: string[]
}

const categoryColors: Record<string, string> = {
    "Laundry": "bg-cyan-300",
    "Grooming": "bg-pink-300",
    "Tech Support": "bg-purple-300",
    "Food Delivery": "bg-orange-300",
    "Coffee Run": "bg-lime-300",
    "Tutoring": "bg-yellow-300",
}

export function ProviderCard({ id, name, bio, location, image, serviceCount, categories }: ProviderCardProps) {
    return (
        <Link to={`/services/${id}`}>
            <Card className="h-full cursor-pointer overflow-hidden group bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all border-4 border-black">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12 border-2 border-black">
                            <AvatarImage src={image || ""} alt={name} />
                            <AvatarFallback className="bg-yellow-300 font-black">
                                {name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl group-hover:text-pink-500 transition-colors truncate">
                                {name}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold mt-1">
                                <Package className="h-3 w-3" />
                                <span>{serviceCount} {serviceCount === 1 ? 'service' : 'services'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 3).map((category) => {
                            const categoryColor = categoryColors[category] || "bg-purple-200"
                            return (
                                <Badge 
                                    key={category} 
                                    variant="outline" 
                                    className={`${categoryColor} border-black font-black text-xs`}
                                >
                                    {category}
                                </Badge>
                            )
                        })}
                        {categories.length > 3 && (
                            <Badge variant="outline" className="bg-gray-200 border-black font-black text-xs">
                                +{categories.length - 3}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pb-3">
                    {bio && (
                        <p className="text-muted-foreground text-sm font-bold line-clamp-2 min-h-[2.5rem]">
                            {bio}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="pt-3 border-t-4 border-black bg-muted/30 group-hover:bg-accent/30 transition-colors">
                    {location && (
                        <div className="flex items-center gap-1 text-xs font-bold">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    )
}
