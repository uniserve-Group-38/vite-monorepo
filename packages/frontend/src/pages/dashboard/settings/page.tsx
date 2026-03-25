"use client"

import { useState, useEffect } from "react"
import { Settings2, UserCircle2, Moon, Sun, Monitor, LogOut, Key, Save, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut, useSession } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  
  // Profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any
      setName(u.name || "")
      setEmail(u.email || "")
      setPhone(u.phoneNumber || "")
      setLocation(u.location || "")
      setBio(u.bio || "")
    }
  }, [session])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/auth/sign-in")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    // Mock update - would normally call an API route here
    setTimeout(() => {
      toast.success("Profile updated successfully (Mock)")
      setIsUpdating(false)
    }, 1000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    toast.success("Password change requested (Mock)")
    setIsChangingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-lime-500" />
      </div>
    )
  }

  const user = session?.user as any

  return (
    <main className="px-4 py-6 md:px-10 md:py-10 min-h-screen bg-transparent">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 border-4 border-black bg-lime-300 shadow-[4px_4px_0_0_#000]">
              <Settings2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">Settings</h1>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-red-600 font-bold uppercase tracking-widest text-[10px]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-4 border-black rounded-3xl shadow-[12px_12px_0_0_#000]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black text-2xl uppercase">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="font-bold text-black/60">
                  You will be signed out of the provider portal. Any unsaved profile changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="border-2 border-black font-black uppercase text-xs">Stay here</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600 border-2 border-black shadow-[4px_4px_0_0_#000] font-black uppercase text-xs"
                >
                  Yes, Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Profile Section */}
        <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] space-y-8">
          <div className="flex items-center justify-between border-b-4 border-black pb-4">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <UserCircle2 className="w-5 h-5 text-lime-600" /> Profile Info
            </h2>
            <div className="inline-flex rounded-full border-2 border-black bg-black px-4 py-1 text-xs font-black uppercase tracking-widest text-lime-300">
              {user?.role || "Service Provider"}
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-6 border-4 border-black rounded-2xl">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-black bg-lime-200 flex items-center justify-center overflow-hidden shrink-0 shadow-[6px_6px_0_0_#000]">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-20 w-20 text-black/30" />
                  )}
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-yellow-300 border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] hover:translate-y-[-2px] transition-transform">
                  <Save className="w-4 h-4 text-black" />
                </button>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</Label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="border-2 border-black font-black text-lg bg-white focus-visible:ring-lime-300 shadow-[4px_4px_0_0_#fef08a]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Work Email</Label>
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
                    className="border-2 border-black font-bold bg-white focus-visible:ring-lime-300" 
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone Number</Label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="border-2 border-black font-bold bg-white focus-visible:ring-lime-300" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Service Location</Label>
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Campus Area A"
                  className="border-2 border-black font-bold bg-white focus-visible:ring-lime-300" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Professional Bio</Label>
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about your service experience..."
                className="border-2 border-black font-bold bg-white focus-visible:ring-lime-300 min-h-[120px] leading-relaxed" 
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit"
                disabled={isUpdating}
                className="min-w-[160px] font-black border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[6px_6px_0_0_#000] h-12 uppercase tracking-widest disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </section>

        {/* Security & Theme Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Section */}
          <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Sun className="w-5 h-5" /> Appearance
              </h2>
              <p className="text-sm font-bold text-black/60">Adjust the brightness and theme of your dashboard.</p>
              
              <div className="grid grid-cols-3 gap-2 p-1 border-2 border-black bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "light" ? "bg-white border-black shadow-[2px_2px_0_0_#000]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Light</span>
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "dark" ? "bg-black text-white border-black shadow-[2px_2px_0_0_#bef264]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Dark</span>
                </button>
                <button 
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${theme === "system" ? "bg-lime-100 border-black shadow-[2px_2px_0_0_#000]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Auto</span>
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Key className="w-5 h-5" /> Security
              </h2>
              
              {!isChangingPassword ? (
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-bold text-black/60">Manage your password and account protection.</p>
                  <Button 
                    onClick={() => setIsChangingPassword(true)}
                    variant="outline" 
                    className="w-full border-2 border-black font-black uppercase tracking-widest hover:bg-amber-100 shadow-[4px_4px_0_0_#000]"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">Current Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">New Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/60">Confirm New Password</Label>
                    <Input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-8 border-2 border-black font-bold focus-visible:ring-lime-300" 
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1 bg-black text-white hover:bg-black/90 border-2 border-black shadow-[2px_2px_0_0_#bef264] font-bold text-xs">
                      Update
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setIsChangingPassword(false)}
                      variant="outline" 
                      className="flex-1 border-2 border-black font-bold text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
