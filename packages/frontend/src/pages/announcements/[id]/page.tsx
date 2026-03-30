import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, ExternalLink, Mail, Loader2 } from "lucide-react";

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/announcements/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            navigate("/404");
            return;
          }
          throw new Error("Failed to fetch announcement");
        }
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!announcement) return null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link to="/announcements">
        <Button 
          variant="outline" 
          className="mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </Button>
      </Link>

      {/* Main Card */}
      <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Hero Image */}
        {announcement.imageUrl && (
          <div className="w-full h-96 overflow-hidden border-b-4 border-black">
            <img 
              src={announcement.imageUrl} 
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="bg-white">
          {/* Category & Verified Badge */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-purple-300 text-black border-2 border-black font-black text-sm px-3 py-1">
              {announcement.category}
            </Badge>
            <div className="bg-green-300 border-2 border-black px-3 py-1 text-sm font-black flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              VERIFIED
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {announcement.title}
          </h1>

          {/* Date */}
          <div className="inline-block bg-yellow-300 border-2 border-black px-4 py-2 font-black text-sm -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            📅 {new Date(announcement.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-white p-8">
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">
              {announcement.content}
            </p>
          </div>

          {/* Call to Actions */}
          {(announcement.externalLink || announcement.contactInfo) && (
            <div className="pt-6 border-t-4 border-black space-y-4">
              {announcement.externalLink && (
                <a href={announcement.externalLink} target="_blank" rel="noopener noreferrer">
                  <button className="bg-black text-white px-8 py-4 font-black text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                    <ExternalLink className="w-5 h-5" />
                    LEARN MORE / APPLY
                  </button>
                </a>
              )}

              {announcement.contactInfo && (
                <div className="flex items-start gap-3 p-6 bg-cyan-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Mail className="w-6 h-6 mt-1" />
                  <div>
                    <p className="font-black text-lg mb-1">CONTACT INFORMATION</p>
                    <p className="font-bold text-base">{announcement.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}