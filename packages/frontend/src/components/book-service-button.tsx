"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface BookServiceButtonProps {
  serviceId: string;
  serviceName: string;
  providerId: string;
  currentUserId: string | undefined;
}

export function BookServiceButton({
  serviceId,
  serviceName,
  providerId,
  currentUserId,
}: BookServiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBook = async () => {
    if (!currentUserId) {
      toast.error("Please log in to book a service");
      navigate("/auth/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          providerId,
          studentId: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();

      toast.success(
        `You have successfully booked ${serviceName}. The provider will reach out to you shortly — keep an eye on your chat screen.`,
        { duration: 5000 }
      );

      if (data.conversationId) {
        navigate(`/chat/${data.conversationId}`);
      } else {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Something went wrong with your booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full text-lg py-6 bg-pink-500 text-white hover:bg-pink-600 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
      size="lg"
      disabled={isLoading}
      onClick={handleBook}
    >
      {isLoading ? "Booking..." : "Book Service Now"}
    </Button>
  );
}
