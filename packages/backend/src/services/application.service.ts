import { applicationRepository } from "../repositories/application.repository";
import { userRepository } from "../repositories/user.repository";

export const applicationService = {
  submitApplication: (
    userId: string,
    body: { businessName: string; description: string; category: string }
  ) => applicationRepository.create({ userId, ...body }),

  reviewApplication: async (
    adminUserId: string,
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    // Double-check the acting user is ADMIN at the service layer
    const admin = await userRepository.findById(adminUserId);
    if (!admin || admin.role !== "ADMIN") {
      throw new Error("FORBIDDEN");
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      throw new Error("INVALID_STATUS");
    }

    const app = await applicationRepository.updateStatus(id, status as any);

    // On approval, promote the user to PROVIDER
    if (status === "APPROVED") {
      await userRepository.updateRole(app.userId, "PROVIDER");
    }

    return app;
  },
};
