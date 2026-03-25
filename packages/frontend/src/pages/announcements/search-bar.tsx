import { useParams } from "react-router-dom";
"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";

  function handleSearch(value: string) {
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      if (currentCategory && currentCategory !== "All") params.set("category", currentCategory);
      const query = params.toString();
      navigate(`/announcements${query ? `?${query}` : ""}`);
    });
  }

  function clearSearch() {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentCategory && currentCategory !== "All") params.set("category", currentCategory);
      const query = params.toString();
      navigate(`/announcements${query ? `?${query}` : ""}`);
    });
  }

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        defaultValue={currentSearch}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search announcements..."
        className={`pl-10 pr-10 ${isPending ? "opacity-50" : ""}`}
      />
      {currentSearch && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}