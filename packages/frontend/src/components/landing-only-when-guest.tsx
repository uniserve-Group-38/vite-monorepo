import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Renders children (landing page) only when the user is not logged in.
 * Until session is known, nothing is shown. Once we know they're logged in,
 * we redirect to /services without ever showing the landing content.
 */
export function LandingOnlyWhenGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === "PROVIDER" || role === "provider") {
        navigate("/dashboard");
      } else {
        navigate("/services");
      }
    }
  }, [session?.user, isPending, navigate]);

  if (isPending) {
    return null;
  }
  if (session?.user) {
    return null;
  }
  return <>{children}</>;
}
