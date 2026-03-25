    "use client";

import { useEffect, useState, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function PaymentCallbackContent() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    reference ? "loading" : "failed"
  );

  useEffect(() => {
    async function verifyPayment(ref: string) {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + `/api/payments/verify?reference=${ref}`);
        const data = await response.json();

        if (data.success && data.status === "success") {
          setStatus("success");
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate("/dashboard/bookings");
          }, 3000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
      }
    }

    if (reference) {
      // Verify payment
      verifyPayment(reference);
    }
  }, [reference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
      {status === "loading" && (
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <Loader2 className="w-24 h-24 mx-auto mb-6 animate-spin" />
          <h1 className="text-4xl font-black mb-4">VERIFYING PAYMENT...</h1>
          <p className="text-lg font-bold">Please wait while we confirm your payment</p>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-300 border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <CheckCircle className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-4">PAYMENT SUCCESS! 🎉</h1>
          <p className="text-lg font-bold mb-2">Your booking is confirmed!</p>
          <p className="text-sm mt-4">Redirecting to your bookings...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-300 border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <XCircle className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-4">PAYMENT FAILED</h1>
          <p className="text-lg font-bold mb-6">Something went wrong with your payment</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-black text-white px-8 py-4 font-black border-4 border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
          <Loader2 className="w-24 h-24 mx-auto mb-6 animate-spin" />
          <h1 className="text-4xl font-black mb-4">LOADING...</h1>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}