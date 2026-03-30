import { useState } from "react"
import { format } from "date-fns"
import { Plus, Pencil, Trash2, Clock, DollarSign, Tag, Loader2, Image as ImageIcon, Star, Check, ArrowRight } from "lucide-react"

type Service = {
  id: string
  title: string
  description: string
  category: string
  price: string | null
  status: string
  imageUrl: string | null
  operatingHours: string | null
  createdAt: Date | string
  providerId: string
}
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent } from "@/components/ui/card"

interface ProviderServicesManagerProps {
  initialServices: Service[]
}

const categoryColors: Record<string, string> = {
  "Academics": "bg-blue-300",
  "Arts & Crafts": "bg-purple-300",
  "Sports & Fitness": "bg-green-300",
  "Music & Dance": "bg-yellow-300",
  "Technology": "bg-red-300",
  "Language": "bg-indigo-300",
  "Life Skills": "bg-orange-300",
  "Other": "bg-pink-300",
  "Laundry": "bg-cyan-300",
  "Grooming": "bg-pink-300",
  "Tech Support": "bg-purple-300",
  "Food Delivery": "bg-orange-300",
  "Coffee Run": "bg-lime-300",
  "Tutoring": "bg-yellow-300",
}

export function ProviderServicesManager({ initialServices }: ProviderServicesManagerProps) {
  const [services, setServices] = useState(initialServices)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  
  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [operatingHours, setOperatingHours] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("")
    setPrice("")
    setOperatingHours("")
    setImageUrl("")
    setCurrentService(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/provider/services`, {
        method: "POST",
        body: JSON.stringify({ title, description, category, price, operatingHours, imageUrl }),
        headers: { "Content-Type": "application/json" }
      })
      
      if (!res.ok) throw new Error("Failed to create service")
      const newService = await res.json()
      setServices([newService, ...services])
      setIsAddOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentService) return
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/provider/services/${currentService.id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, category, price, operatingHours, imageUrl }),
        headers: { "Content-Type": "application/json" }
      })
      
      if (!res.ok) throw new Error("Failed to update service")
      const updatedService = await res.json()
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s))
      setIsEditOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/provider/services/${id}`, {
        method: "DELETE",
      })
      
      if (!res.ok) throw new Error("Failed to delete service")
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const openEdit = (service: Service) => {
    setCurrentService(service)
    setTitle(service.title)
    setDescription(service.description)
    setCategory(service.category)
    setPrice(service.price || "")
    setOperatingHours(service.operatingHours || "")
    setImageUrl(service.imageUrl || "")
    setIsEditOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("fileName", file.name)
    formData.append("folder", "services")

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/upload-image`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error(error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          Your Services
        </h2>
        
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="font-bold border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0_0_#000] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Create New Service</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto px-1 pr-4 -mr-4">
              <form onSubmit={handleCreate} className="space-y-4 pt-4 pb-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Service Image / Flyer</Label>
                  <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-black rounded-xl bg-gray-50">
                    {imageUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-black">
                        <img src={imageUrl} alt="Preview"  className="object-cover" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                          onClick={() => setImageUrl("")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full min-h-[120px] cursor-pointer hover:bg-gray-100 transition-colors">
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-lime-600" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 mb-2 text-black/40" />
                            <span className="text-sm font-bold text-black/60">Click to upload photo or flyer</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Title <span className="text-red-500">*</span></Label>
                  <Input required value={title} onChange={e => setTitle(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Calculus Tutoring" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Category <span className="text-red-500">*</span></Label>
                  <Input required value={category} onChange={e => setCategory(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Academics" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Description <span className="text-red-500">*</span></Label>
                  <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 min-h-[100px] font-medium" placeholder="Describe what you offer..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase tracking-wide text-xs">Price</Label>
                    <Input value={price} onChange={e => setPrice(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. $20/hr" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase tracking-wide text-xs">Operating Hours</Label>
                    <Input value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" placeholder="e.g. Mon-Fri 5PM-9PM" />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 font-black text-lg border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000]">
                  Publish Service
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) resetForm()
        }}>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0_0_#000] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Edit Service</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto px-1 pr-4 -mr-4">
              <form onSubmit={handleUpdate} className="space-y-4 pt-4 pb-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Service Image / Flyer</Label>
                  <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-black rounded-xl bg-gray-50">
                    {imageUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-black">
                        <img src={imageUrl} alt="Preview"  className="object-cover" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                          onClick={() => setImageUrl("")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full min-h-[120px] cursor-pointer hover:bg-gray-100 transition-colors">
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-lime-600" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 mb-2 text-black/40" />
                            <span className="text-sm font-bold text-black/60">Click to upload photo or flyer</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Title <span className="text-red-500">*</span></Label>
                  <Input required value={title} onChange={e => setTitle(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Category <span className="text-red-500">*</span></Label>
                  <Input required value={category} onChange={e => setCategory(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase tracking-wide text-xs">Description <span className="text-red-500">*</span></Label>
                  <Textarea required value={description} onChange={e => setDescription(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 min-h-[100px] font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase tracking-wide text-xs">Price</Label>
                    <Input value={price} onChange={e => setPrice(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase tracking-wide text-xs">Operating Hours</Label>
                    <Input value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="border-2 border-black focus-visible:ring-lime-300 font-medium" />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 font-black text-lg border-2 border-black bg-lime-300 text-black hover:bg-lime-400 shadow-[4px_4px_0_0_#000]">
                  Save Changes
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!services.length ? (
        <section className="rounded-2xl border-4 border-dashed border-black bg-white/70 p-10 text-center">
          <h2 className="text-xl font-extrabold uppercase tracking-[0.18em]">
            No active services
          </h2>
          <p className="mt-2 text-sm text-foreground/70 font-medium">
            You haven&apos;t created any services yet. Add one to get started!
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
            const categoryBg = categoryColors[service.category] || "bg-pink-300"
            
            return (
              <article
                key={service.id}
                className="group relative border-[3px] border-black bg-white shadow-[6px_6px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#000] transition-all overflow-hidden flex flex-col h-full"
              >
                {/* Header with image */}
                <div className="relative aspect-video w-full border-b-[3px] border-black bg-slate-50 overflow-hidden">
                  <img src={service.imageUrl || "https://furntech.org.za/wp-content/uploads/2017/05/placeholder-image.png"} alt={service.title}  className="object-cover" />
                  
                  {/* Tilted Verified Badge Overlay */}
                  <div className="absolute top-3 right-3 bg-[#86efac] border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_#000] flex items-center gap-1 -rotate-2 z-10">
                    <Check className="w-3 h-3 text-black stroke-[3px]" />
                    <span className="text-[10px] font-black uppercase tracking-tight">Verified</span>
                  </div>
                </div>

                {/* Content Body Match Photo */}
                <CardContent className={`${categoryBg} p-5 flex-grow flex flex-col gap-3 bg-opacity-30`}>
                  {/* Category text */}
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                    {service.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-black uppercase leading-none tracking-tight text-black line-clamp-2">
                    {service.title}
                  </h3>

                  <div className="flex items-end justify-between mt-auto">
                    {/* Rating Box placeholder */}
                    <div className="bg-yellow-400 border-2 border-black px-2 py-1 flex items-center gap-1.5 shadow-[2px_2px_0_0_#000]">
                      <Star className="w-3 h-3 fill-black text-black" />
                      <span className="font-black text-[10px]">4.6 <span className="opacity-60">(92)</span></span>
                    </div>

                    {/* Price - Large Text */}
                    <div className="text-xl font-black tracking-tighter text-black">
                      {service.price || "FREE"}
                    </div>
                  </div>
                </CardContent>

                {/* Actions Footer - Black Bar */}
                <div className="mt-auto border-t-[3px] border-black flex">
                  <button 
                    onClick={() => openEdit(service)}
                    className="flex-1 bg-white hover:bg-amber-100 border-r-[3px] border-black p-3 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="bg-black hover:bg-red-500 p-3 flex items-center justify-center transition-colors px-5 active:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
