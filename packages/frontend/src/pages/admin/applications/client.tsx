"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Application {
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

export default function AdminApplicationsClient({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    try {
      const resp = await fetch(import.meta.env.VITE_API_URL + `/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!resp.ok) throw new Error("Failed to update application");

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      toast.success(`Application ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error("Failed to update application status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid gap-6">
      {applications.length === 0 && (
        <p className="text-xl font-bold text-gray-500 italic">No applications found.</p>
      )}
      {applications.map((app) => (
        <Card key={app.id} className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-black">{app.businessName}</CardTitle>
              <CardDescription className="text-lg font-bold text-cyan-600">{app.category}</CardDescription>
            </div>
            <Badge 
              className={`text-lg font-bold border-2 border-black ${
                app.status === "PENDING" ? "bg-yellow-300 text-black" : 
                app.status === "APPROVED" ? "bg-green-400 text-black" : 
                "bg-red-400 text-black"
              }`}
            >
              {app.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mt-2">
              <div>
                <p className="font-black text-sm uppercase text-gray-500">Applicant</p>
                <p className="text-lg font-bold">{app.user.name} ({app.user.email})</p>
              </div>
              <div>
                <p className="font-black text-sm uppercase text-gray-500">Description</p>
                <p className="text-lg leading-tight">{app.description}</p>
              </div>
              
              {app.status === "PENDING" && (
                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => handleAction(app.id, "APPROVED")}
                    disabled={loadingId === app.id}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                  >
                    {loadingId === app.id ? <Loader2 className="animate-spin" /> : <Check className="mr-2" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(app.id, "REJECTED")}
                    disabled={loadingId === app.id}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                  >
                    {loadingId === app.id ? <Loader2 className="animate-spin" /> : <X className="mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
