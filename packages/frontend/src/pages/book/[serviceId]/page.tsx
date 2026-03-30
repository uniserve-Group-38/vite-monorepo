import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  provider: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BookServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    }
    fetchCurrentUser();
  }, [serviceId]);

  async function fetchCurrentUser() {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/auth/get-session`);
      const data = await response.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/sign-in");
    }
  }

  async function fetchService(id: string) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/services/${id}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBooking() {
    if (!currentUser || !service) return;

    setIsBooking(true);

    try {
      // Create booking WITHOUT payment
      const bookingResponse = await fetch(import.meta.env.VITE_API_URL + `/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          providerId: service.provider.id,
          studentId: currentUser.id,
        }),
      });

      const bookingText = await bookingResponse.text();
      console.log("Booking response:", bookingText);

      if (!bookingResponse.ok) {
        alert("Failed to create booking");
        setIsBooking(false);
        return;
      }

      const bookingData = JSON.parse(bookingText);

      // Success - redirect to bookings page (NO PAYMENT YET)
      alert("Booking created successfully! You'll be prompted to pay after service completion.");
      navigate("/bookings");

    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking: " + error);
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Service not found</p>
      </div>
    );
  }

  // Remove currency symbol and parse
  const price = service.price 
    ? parseFloat(service.price.replace(/[^\d.]/g, '')) 
    : 0;

  if (isNaN(price) || price <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
        <Card className="border-8 border-black p-8">
          <p className="text-xl font-black">Invalid service price. Please contact support.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="bg-yellow-300 border-b-4 border-black">
            <CardTitle className="text-3xl font-black">BOOK SERVICE</CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Service Details */}
            <div>
              <h2 className="text-2xl font-black mb-2">{service.title}</h2>
              <p className="text-sm font-bold text-muted-foreground mb-4">{service.category}</p>
              <p className="text-base font-medium">{service.description}</p>
            </div>

            {/* Provider Info */}
            {service.provider && (
              <div className="bg-cyan-100 border-4 border-black p-4">
                <p className="font-black text-sm mb-1">SERVICE PROVIDER</p>
                <p className="font-bold">{service.provider.name}</p>
                <p className="text-sm text-muted-foreground">{service.provider.email}</p>
              </div>
            )}

            {/* Price Info */}
            <div className="bg-white border-4 border-black p-6">
              <h3 className="text-xl font-black mb-4">SERVICE COST</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Service Cost:</span>
                  <span>GH₵ {price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-bold">Payment after service completion</p>
                  <p className="text-xs mt-1">You'll be prompted to pay once the provider marks the service as completed.</p>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-black text-white px-10 py-6 font-black text-2xl border-6 border-black hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  BOOKING...
                </>
              ) : (
                "BOOK NOW"
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Payment will be requested after service completion
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}