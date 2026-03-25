import { prisma } from "@/lib/prisma"
import { ServiceCard } from "@/components/service-card"
import { ServiceSearch } from "@/components/service-search"
import { CategoryFilter } from "@/components/category-filter"
import { Prisma } from "@/lib/generated/prisma/client"

export const dynamic = 'force-dynamic'

interface SearchParams {
    q?: string
    category?: string
    page?: string
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const query = params.q
    const category = params.category
    const page = parseInt(params.page || '1', 10)
    const take = 6
    const skip = (page - 1) * take

    // 1. Fetch distinct categories
    const categoriesData = await prisma.service.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
    })
    const categories = categoriesData.map(c => c.category)

    // 2. Build filter conditions
    const where: Prisma.ServiceWhereInput = {
        AND: [
            // Search Filter
            query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            // Category Filter
            category ? { category: { equals: category } } : {},
        ]
    }

    // 3. Fetch filtered services with pagination
    const [services, totalServices] = await Promise.all([
        prisma.service.findMany({
            where,
            include: { provider: true },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        }),
        prisma.service.count({ where })
    ])

    const totalPages = Math.ceil(totalServices / take)

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

                {services.length === 0 ? (
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
                                provider={{
                                    name: service.provider.name,
                                    image: service.provider.image,
                                    location: service.provider.location,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-6 max-w-7xl mx-auto px-4">
                    {page > 1 ? (
                        <a
                            href={`/services?page=${page - 1}${query ? `&q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                            className="border-4 border-black bg-pink-300 px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            PREVIOUS
                        </a>
                    ) : (
                        <div className="px-6 py-2 w-[130px] invisible"></div>
                    )}

                    <span className="font-bold border-4 border-black bg-white px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                        <a
                            href={`/services?page=${page + 1}${query ? `&q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                            className="border-4 border-black bg-cyan-300 px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            NEXT
                        </a>
                    ) : (
                        <div className="px-6 py-2 w-[100px] invisible"></div>
                    )}
                </div>
            )}
        </div>
    )
}
