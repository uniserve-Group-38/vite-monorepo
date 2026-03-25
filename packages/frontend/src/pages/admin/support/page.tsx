import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type SupportMsg = {
  id: string
  subject: string
  message: string
  status: string
  createdAt: string
  user: { name: string; email: string }
}

export default function AdminSupportPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = useSession()
  const [messages, setMessages] = useState<SupportMsg[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      navigate("/auth/sign-in")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/support`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => { setMessages(Array.isArray(d) ? d : d.messages ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, isPending, navigate])

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" className="font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="inline-block text-4xl sm:text-5xl font-black tracking-tight">
            <span className="bg-cyan-200 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1 text-black">
              SUPPORT INBOX
            </span>
          </h1>
          <p className="text-lg font-bold mt-2 text-muted-foreground">
            View and manage incoming user complaints and requests.
          </p>
        </div>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader className="border-b-4 border-black bg-cyan-50">
            <CardTitle className="text-2xl font-black uppercase">Support Messages</CardTitle>
            <CardDescription className="font-bold text-black font-mono">
              Total Messages: {messages.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black">
                  <TableRow className="border-black hover:bg-black">
                    <TableHead className="text-white font-bold w-[200px]">User</TableHead>
                    <TableHead className="text-white font-bold w-[250px]">Subject</TableHead>
                    <TableHead className="text-white font-bold">Message</TableHead>
                    <TableHead className="text-white font-bold w-[120px]">Status</TableHead>
                    <TableHead className="text-white font-bold w-[150px]">Date</TableHead>
                    <TableHead className="text-white font-bold w-[100px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id} className="border-b-2 border-black hover:bg-yellow-50">
                      <TableCell className="font-bold">
                        <div className="flex flex-col">
                          <span>{msg.user.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{msg.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{msg.subject}</TableCell>
                      <TableCell className="text-sm">
                        <div className="max-w-[400px] truncate" title={msg.message}>{msg.message}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-bold border-2 rounded-none ${
                          msg.status === "Open" ? "border-red-500 bg-red-100 text-red-800" :
                          msg.status === "In Progress" ? "border-yellow-500 bg-yellow-100 text-yellow-800" :
                          "border-green-500 bg-green-100 text-green-800"
                        }`}>
                          {msg.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{format(new Date(msg.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/support/${msg.id}`}>
                          <Button size="sm" className="font-bold bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-200 transition-all rounded-none">
                            VIEW
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {messages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 font-bold text-muted-foreground">
                        No support messages found.
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
