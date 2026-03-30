
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Plus, CheckCircle } from "lucide-react";

const CATEGORIES = ["Events", "Scholarships", "Tuition", "Internships", "Deadlines", "Academic"];

export default function AdminAnnouncementsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Events",
    externalLink: "",
    contactInfo: "",
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload image to ImageKit if exists
      let imageUrl = "";
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("fileName", `announcement-${Date.now()}-${imageFile.name}`);
        uploadFormData.append("folder", "announcements");

        const uploadRes = await fetch(import.meta.env.VITE_API_URL + `/api/upload-image`, {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      // Create announcement
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          isVerified: true,
          isActive: true,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/admin/announcements");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-green-300 flex items-center justify-center p-4">
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <CheckCircle className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-4">SUCCESS!</h1>
          <p className="text-xl font-bold">Announcement posted! 🎉</p>
          <p className="text-sm mt-4">Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/admin/announcements">
          <button className="mb-6 bg-white border-4 border-black px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            BACK TO ADMIN
          </button>
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-black text-white px-8 py-3 font-black text-sm border-4 border-black rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
            ⚡ ADMIN PANEL ⚡
          </div>
          <h1 className="text-6xl font-black mb-4">
            <span className="inline-block bg-yellow-300 border-8 border-black px-6 py-3 -rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              CREATE
            </span>
            <br />
            <span className="inline-block bg-pink-400 border-8 border-black px-6 py-3 rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-4">
              ANNOUNCEMENT
            </span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
            
            {/* Title */}
            <div>
              <Label className="text-xl font-black mb-2 block">TITLE *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="Enter announcement title..."
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-xl font-black mb-2 block">CATEGORY *</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-3 font-black text-sm border-4 border-black transition-all ${
                      formData.category === cat
                        ? "bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1"
                        : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <Label className="text-xl font-black mb-2 block">SUMMARY</Label>
              <Input
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="Short preview (optional)..."
              />
            </div>

            {/* Content */}
            <div>
              <Label className="text-xl font-black mb-2 block">CONTENT *</Label>
              <Textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none"
                placeholder="Full announcement content..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-xl font-black mb-2 block">IMAGE (Optional)</Label>
              <div className="border-4 border-black border-dashed p-8 text-center bg-cyan-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto border-4 border-black" />
                  ) : (
                    <div>
                      <Upload className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-black text-lg">CLICK TO UPLOAD IMAGE</p>
                      <p className="text-sm mt-2">PNG, JPG, WEBP (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* External Link */}
            <div>
              <Label className="text-xl font-black mb-2 block">EXTERNAL LINK (Optional)</Label>
              <Input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                className="border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="https://..."
              />
            </div>

            {/* Contact Info */}
            <div>
              <Label className="text-xl font-black mb-2 block">CONTACT INFO (Optional)</Label>
              <Input
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="border-4 border-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="email@example.com or phone number..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white px-10 py-6 font-black text-2xl border-6 border-black hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {isSubmitting ? "POSTING..." : "POST ANNOUNCEMENT"}
              <Plus size={32} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}