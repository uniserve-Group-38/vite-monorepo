"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Loader2, Bell, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface PendingApplication {
  id: string;
  businessName: string;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface Props {
  initialPending: PendingApplication[];
}

export default function PendingApplicationsCard({ initialPending }: Props) {
  const [pending, setPending] = useState<PendingApplication[]>(initialPending);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    setLoadingAction(status);

    // Retry up to 3 times with 1.5s backoff to handle Neon cold-start timeouts
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1500;

    let lastError: string = "Failed to update application status.";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(import.meta.env.VITE_API_URL + `/api/admin/applications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        if (resp.status === 401) {
          lastError = "Unauthorized — please refresh and try again.";
          break; // Don't retry auth failures
        }

        if (resp.ok) {
          setPending((prev) => prev.filter((app) => app.id !== id));
          toast.success(
            status === "APPROVED"
              ? "Application approved — user promoted to Provider!"
              : "Application rejected."
          );
          setLoadingId(null);
          setLoadingAction(null);
          return;
        }

        // 5xx — transient, retry
        lastError = `Server error (attempt ${attempt}/${MAX_RETRIES}).`;
      } catch {
        lastError = `Network error (attempt ${attempt}/${MAX_RETRIES}).`;
      }

      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }

    toast.error(lastError + " Please try again.");
    setLoadingId(null);
    setLoadingAction(null);
  };

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
      {/* Header */}
      <CardHeader className="border-b-4 border-black bg-orange-50 flex flex-row items-center justify-between space-y-0 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6" />
            {pending.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                {pending.length}
              </span>
            )}
          </div>
          <CardTitle className="text-2xl font-black uppercase">
            Pending Provider Applications
          </CardTitle>
          {pending.length > 0 && (
            <Badge className="bg-yellow-300 text-black border-2 border-black font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm ml-2">
              {pending.length} PENDING
            </Badge>
          )}
        </div>
        <Link to="/admin/applications">
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-none flex items-center gap-2"
          >
            View All <ExternalLink className="w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-14 h-14 bg-green-100 border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Check className="w-7 h-7 text-green-700" />
            </div>
            <p className="text-lg font-black uppercase">All caught up!</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">
              No pending provider applications.
            </p>
          </div>
        ) : (
          <div className="divide-y-4 divide-black">
            {pending.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-orange-50/50 transition-colors"
              >
                {/* Application info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-black truncate">
                      {app.businessName}
                    </span>
                    <Badge className="bg-cyan-200 text-black border-2 border-black font-bold rounded-none text-xs shrink-0">
                      {app.category}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground mt-0.5">
                    {app.user.name}{" "}
                    <span className="font-mono">({app.user.email})</span>
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1 line-clamp-1">
                    {app.description}
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-1">
                    Applied {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAction(app.id, "APPROVED")}
                    disabled={loadingId === app.id}
                    className="bg-green-400 hover:bg-green-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all"
                  >
                    {loadingId === app.id && loadingAction === "APPROVED" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(app.id, "REJECTED")}
                    disabled={loadingId === app.id}
                    className="bg-red-400 hover:bg-red-500 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 rounded-none transition-all"
                  >
                    {loadingId === app.id && loadingAction === "REJECTED" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 mr-1" />
                    )}
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
