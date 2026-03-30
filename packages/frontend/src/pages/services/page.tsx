import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { ServiceCard } from "@/components/service-card"
import { ServiceSearch } from "@/components/service-search"
import { CategoryFilter } from "@/components/category-filter"
import { Loader2 } from "lucide-react"

interface ServiceProvider {
    name: string
    image: string | null
    location: string | null
}

interface Service {
    id: string
    title: string
    description: string
    category: string
    status: string
    price: string | null
    imageUrl: string | null
    provider: ServiceProvider
}

export default function ServicesPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)

    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (query) params.set('q', query)
                if (category) params.set('category', category)
                if (page > 1) params.set('page', page.toString())

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services?${params.toString()}`)
                if (!response.ok) throw new Error('Failed to fetch services')
                
                const data = await response.json()
                setServices(data.services || [])
                setCategories(data.categories || [])
                setTotalPages(data.totalPages || 1)
            } catch (error) {
                console.error("Error fetching services:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchServices()
    }, [query, category, page])

    return (
        <div className="min-h-screen bg-[#f3f4f6] py-12">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-col gap-4">
                        <h1 className="inline-block">
                            <span className="bg-yellow-400 border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block text-4xl sm:text-6xl font-black tracking-tighter -rotate-1">
                                SERVICES
                            </span>
                        </h1>
                        <p className="text-xl font-bold mt-6 text-black/80 max-w-2xl">
                            Browse available services from verified providers in your area.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                        <ServiceSearch />
                    </div>

                    <CategoryFilter categories={categories} />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
                    </div>
                ) : services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <p className="font-black text-2xl mb-4">No services found.</p>
                        <p className="font-bold text-muted-foreground">
                            {query || category
                                ? "Try adjusting your search or filters."
                                : "Check back later for new listings."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                title={service.title}
                                description={service.description}
                                category={service.category}
                                status={service.status}
                                price={service.price}
                                imageUrl={service.imageUrl}
                                index={index}
                                provider={service.provider}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-6 max-w-7xl mx-auto px-4">
                    {page > 1 ? (
                        <Link
                            to={`/services?page=${page - 1}${query ? `&q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                            className="border-4 border-black bg-pink-300 px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            PREVIOUS
                        </Link>
                    ) : (
                        <div className="px-6 py-2 w-[130px] invisible"></div>
                    )}

                    <span className="font-bold border-4 border-black bg-white px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                        <Link
                            to={`/services?page=${page + 1}${query ? `&q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                            className="border-4 border-black bg-cyan-300 px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            NEXT
                        </Link>
                    ) : (
                        <div className="px-6 py-2 w-[100px] invisible"></div>
                    )}
                </div>
            )}
        </div>
    )
}
