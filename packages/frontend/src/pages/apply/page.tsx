"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ApplyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const resp = await fetch(import.meta.env.VITE_API_URL + `/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "Something went wrong");
      }

      setStatus({ type: "success", message: "Application submitted successfully! Admins will review it soon." });
      setFormData({ businessName: "", description: "", category: "" });
      
      // Optionally redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none">
        <CardHeader className="space-y-3 pb-6 border-b-4 border-black mb-6 bg-yellow-400">
          <CardTitle className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Apply to be a Service Provider</CardTitle>
          <CardDescription className="text-lg sm:text-xl font-bold text-black/80">
            Join the Uniserve network and start offering your services to the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-xl font-bold">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Ex. Speedy Tech Solutions"
                className="border-2 border-black p-6 text-lg"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xl font-bold">Category</Label>
              <Input
                id="category"
                placeholder="Ex. Cleaning, Tutoring, Home Repair"
                className="border-2 border-black p-6 text-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xl font-bold">Tell us about your services</Label>
              <Textarea
                id="description"
                placeholder="Describe what you offer and your experience..."
                className="border-2 border-black min-h-[150px] p-4 text-lg"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {status && (
              <Alert variant={status.type === "success" ? "default" : "destructive"} className="border-2 border-black">
                {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle className="font-bold">{status.type === "success" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black text-2xl py-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
