import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import AdminApplicationsClient from "./client"
import { Loader2 } from "lucide-react"

export default function AdminApplicationsPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/applications`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setApplications(Array.isArray(d) ? d : d.applications ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-black mb-8 underline decoration-yellow-400 decoration-8 underline-offset-8">
        Provider Applications
      </h1>
      <AdminApplicationsClient initialApplications={applications} />
    </div>
  )
}
