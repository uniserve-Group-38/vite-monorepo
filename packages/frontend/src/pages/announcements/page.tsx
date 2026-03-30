import { getImageKitUrl } from "@/lib/imagekit/config";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import SearchBar from "./search-bar";

const CATEGORIES = ["All", "Events", "Scholarships", "Tuition", "Internships", "Deadlines", "Academic"];

interface Announcement {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const activeCategory = category || "All";

  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/announcements`);
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setAllAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = allAnnouncements.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-block bg-cyan-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-3 -rotate-1 mb-4">
          <h1 className="text-3xl font-black uppercase">Campus Announcements</h1>
        </div>
        <p className="text-muted-foreground font-bold text-lg">
          Stay updated with the latest events, internships, and campus news
        </p>
        
        {/* Test ImageKit image */}
        <div className="mt-4">
          <img 
            src={getImageKitUrl('image_a4645388.png', 'w-400,h-300')} 
            alt="Test" 
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Search Bar */}
      <Suspense fallback={<div className="h-10 bg-muted rounded-md mb-6 animate-pulse" />}>
        <SearchBar />
      </Suspense>

      {/* Category Filter Tabs */}
      <div className="flex gap-3 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={
              cat === "All"
                ? search ? `/announcements?search=${search}` : "/announcements"
                : search
                ? `/announcements?category=${cat}&search=${search}`
                : `/announcements?category=${cat}`
            }
          >
            <Badge
              variant={activeCategory === cat ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all hover:-translate-y-0.5 ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "bg-white hover:bg-yellow-300"
              }`}
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm font-bold text-muted-foreground mb-4">
        {isLoading 
            ? "Loading..." 
            : `${filteredAnnouncements.length} announcement${filteredAnnouncements.length !== 1 ? "s" : ""} found${activeCategory !== "All" ? ` in ${activeCategory}` : ""}${search ? ` matching "${search}"` : ""}`
        }
      </p>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card className="bg-purple-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <p className="text-center font-bold">
              No announcements found {activeCategory !== "All" && `in ${activeCategory}`}. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Link
              key={announcement.id}
              to={`/announcements/${announcement.id}`}
              className="block"
            >
              <Card className="cursor-pointer border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-purple-200 border-2 border-black font-black">{announcement.category}</Badge>
                        {announcement.isVerified && (
                          <div className="flex items-center gap-1">
                            <div className="bg-green-300 border-2 border-black px-2 py-0.5 text-xs font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </div>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-black">{announcement.title}</CardTitle>
                    </div>
                    <time className="text-sm font-bold text-muted-foreground whitespace-nowrap bg-yellow-300 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  {announcement.summary && (
                    <CardDescription className="mt-2 line-clamp-2 font-bold text-black/80">
                      {announcement.summary}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}