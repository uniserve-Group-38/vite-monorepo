import { z } from "zod";

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url().optional().nullable(),
  externalLink: z.string().url().optional().nullable(),
  contactInfo: z.string().optional().nullable(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const CreateApplicationSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

export const ReviewApplicationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const CreateBookingSchema = z.object({
  studentId: z.string().optional(),
  userId: z.string().optional(),
  student_id: z.string().optional(),
  user_id: z.string().optional(),
  providerId: z.string().optional(),
  provider_id: z.string().optional(),
  serviceId: z.string().optional(),
  service_id: z.string().optional(),
});

export const SendMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  conversationId: z.string().min(1, "Conversation ID is required"),
  id: z.string().optional(),
});

export const MarkReadSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
});

export const InitializePaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const CreateServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().optional(),
  operatingHours: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

export const UpdateServiceSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  operatingHours: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
});
