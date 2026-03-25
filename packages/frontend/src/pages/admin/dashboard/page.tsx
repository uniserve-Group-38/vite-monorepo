import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type DashUser = {
  id: string
  name: string
  email: string
  image: string | null
  emailVerified: boolean
  createdAt: string
  _count: { services: number }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [users, setUsers] = useState<DashUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setUsers(Array.isArray(d) ? d : d.users ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="inline-block text-4xl sm:text-5xl font-black tracking-tight">
            <span className="bg-yellow-300 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
              ADMIN DASHBOARD
            </span>
          </h1>
          <p className="text-lg font-bold mt-4 text-muted-foreground">
            Manage users, services, and support messages.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black uppercase inline-block border-b-4 border-black pb-1">
            System Users
          </h2>
          <Link to="/admin/support">
            <Button className="font-bold bg-cyan-200 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-2">
              <span>View Support Inbox</span>
            </Button>
          </Link>
        </div>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="border-b-4 border-black bg-purple-50">
            <CardTitle className="text-2xl font-black uppercase">Registered Users</CardTitle>
            <CardDescription className="font-bold text-black font-mono">
              Total Users: {users.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black">
                  <TableRow className="border-black hover:bg-black">
                    <TableHead className="text-white font-bold w-[250px]">Name</TableHead>
                    <TableHead className="text-white font-bold">Email</TableHead>
                    <TableHead className="text-white font-bold">Status</TableHead>
                    <TableHead className="text-white font-bold">Services</TableHead>
                    <TableHead className="text-white font-bold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b-2 border-black hover:bg-yellow-50">
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-2 border-black" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-cyan-200 flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-bold border-2 rounded-none ${user.emailVerified ? "border-green-500 bg-green-100 text-green-800" : "border-red-500 bg-red-100 text-red-800"}`}>
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono font-bold">{user._count?.services ?? 0}</TableCell>
                      <TableCell className="text-sm font-medium">{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 font-bold text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
