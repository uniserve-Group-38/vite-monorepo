"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  category: string;
  summary: string | null;
  imageUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/announcements/all`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
        alert("Announcement deleted successfully!");
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Error deleting announcement");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-4xl font-black">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block bg-black text-white px-6 py-2 font-black text-sm border-4 border-black rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                ⚡ ADMIN PANEL ⚡
              </div>
              <h1 className="text-6xl font-black">
                <span className="inline-block bg-yellow-300 border-8 border-black px-6 py-3 -rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  MANAGE
                </span>
                <br />
                <span className="inline-block bg-pink-400 border-8 border-black px-6 py-3 rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-4">
                  ANNOUNCEMENTS
                </span>
              </h1>
            </div>

            {/* Create Button */}
            <Link to="/admin/announcements/create">
              <button className="bg-black text-white px-8 py-4 font-black text-xl border-6 border-black hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <Plus size={28} />
                NEW POST
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-cyan-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <div className="text-4xl font-black mb-1">{announcements.length}</div>
            <div className="text-sm font-black uppercase">Total Posts</div>
          </div>
          <div className="bg-green-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <div className="text-4xl font-black mb-1">
              {announcements.filter((a) => a.isActive).length}
            </div>
            <div className="text-sm font-black uppercase">Active</div>
          </div>
          <div className="bg-yellow-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <div className="text-4xl font-black mb-1">
              {announcements.filter((a) => a.isVerified).length}
            </div>
            <div className="text-sm font-black uppercase">Verified</div>
          </div>
        </div>

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="bg-white border-8 border-black p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle className="w-24 h-24 mx-auto mb-4" />
            <p className="text-2xl font-black">NO ANNOUNCEMENTS YET!</p>
            <p className="mt-2 font-bold">Click "NEW POST" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              >
                <div className="flex">
                  {/* Image thumbnail */}
                  {announcement.imageUrl && (
                    <div className="w-48 h-48 border-r-4 border-black flex-shrink-0">
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-300 text-black border-2 border-black font-black">
                            {announcement.category}
                          </Badge>
                          {announcement.isVerified && (
                            <div className="bg-green-300 border-2 border-black px-2 py-1 text-xs font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              VERIFIED
                            </div>
                          )}
                          {!announcement.isActive && (
                            <div className="bg-red-300 border-2 border-black px-2 py-1 text-xs font-black">
                              INACTIVE
                            </div>
                          )}
                        </div>

                        <h3 className="text-2xl font-black mb-2">{announcement.title}</h3>

                        {announcement.summary && (
                          <p className="text-sm font-bold text-muted-foreground line-clamp-2">
                            {announcement.summary}
                          </p>
                        )}

                        <p className="text-xs font-bold text-muted-foreground mt-3">
                          Posted: {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(announcement.id, announcement.title)}
                        disabled={deletingId === announcement.id}
                        className="bg-red-500 text-white px-6 py-3 font-black border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === announcement.id ? (
                          "..."
                        ) : (
                          <>
                            <Trash2 size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}