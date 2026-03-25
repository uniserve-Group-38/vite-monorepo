"use client";

import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Redirects to /services when the user is logged in.
 * Used on the landing page so logged-in users go straight to the app.
 */
export function RedirectIfLoggedIn() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      navigate("/services");
    }
  }, [session?.user, isPending, router]);

  return null;
}
