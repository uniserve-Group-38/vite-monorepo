import { bookingRepository } from "../repositories/booking.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { walletRepository } from "../repositories/wallet.repository";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE = "https://api.paystack.co";

export const paymentService = {
  initializePayment: async (bookingId: string, studentId: string) => {
    const booking = await bookingRepository.findByIdWithDetails(bookingId);
    if (!booking) throw new Error("NOT_FOUND");

    const servicePrice = parseFloat(
      booking.service.price?.replace(/[^\d.]/g, "") || "0"
    );
    if (servicePrice <= 0) throw new Error("INVALID_PRICE");

    const totalAmount = servicePrice;
    const platformCommission = totalAmount * 0.15; // 15% platform fee
    const providerEarnings = totalAmount - platformCommission;
    const amountInPesewas = Math.round(totalAmount * 100);

    const paystackResponse = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: booking.student.email,
        amount: amountInPesewas,
        reference: `uniserve_${bookingId}_${Date.now()}`,
        metadata: {
          bookingId,
          studentId,
          providerId: booking.providerId,
          totalAmount,
          platformCommission,
          providerEarnings,
        },
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      }),
    });

    const paystackData = await paystackResponse.json() as any;
    if (!paystackData.status) {
      console.error("Paystack error:", paystackData);
      throw new Error("PAYSTACK_ERROR");
    }

    await transactionRepository.create({
      bookingId,
      studentId,
      providerId: booking.providerId,
      paystackReference: paystackData.data.reference,
      totalAmount,
      platformCommission,
      providerEarnings,
    });

    return {
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    };
  },

  verifyPayment: async (reference: string) => {
    const paystackResponse = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );
    const paystackData = await paystackResponse.json() as any;
    if (!paystackData.status) throw new Error("VERIFY_FAILED");

    const transaction = await transactionRepository.findByReference(reference);
    if (!transaction) throw new Error("NOT_FOUND");

    return {
      success: true,
      status: paystackData.data.status,
      amount: paystackData.data.amount / 100, // pesewas → cedis
      transaction,
    };
  },

  handleWebhook: async (rawBody: Buffer, signature: string) => {
    // Verify Paystack HMAC-SHA512 signature against the raw bytes
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) throw new Error("INVALID_SIGNATURE");

    const body = JSON.parse(rawBody.toString());
    const event: string = body.event;
    const data = body.data;

    console.log("Webhook received:", event, "Reference:", data.reference);

    if (event !== "charge.success") {
      return { received: true };
    }

    const transaction = await transactionRepository.findByReferenceWithBooking(
      data.reference
    );
    if (!transaction) throw new Error("NOT_FOUND");

    await transactionRepository.markSuccess(transaction.id, data.channel);
    await bookingRepository.markAttended(transaction.bookingId);
    await walletRepository.upsert(transaction.providerId, transaction.providerEarnings);

    console.log("Payment processed successfully:", {
      reference: data.reference,
      amount: transaction.totalAmount,
      providerEarnings: transaction.providerEarnings,
      platformCommission: transaction.platformCommission,
    });

    return { success: true };
  },
};
