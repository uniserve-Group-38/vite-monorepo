import { authClient } from "@/lib/auth-client"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { useNavigate, useLocation } from "react-router-dom"

export default function BetterAuthUIProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={navigate}
      pathname={location.pathname}
      onSessionChange={() => {}}
    >
      {children}
    </AuthUIProvider>
  )
}
