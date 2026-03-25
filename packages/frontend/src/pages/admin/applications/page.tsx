import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
;
import AdminApplicationsClient from "./client";

export default async function AdminApplicationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    window.location.href = "/auth/sign-in";
  }

  const applications = await prisma.serviceProviderApplication.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-black mb-8 underline decoration-yellow-400 decoration-8 underline-offset-8">
        Provider Applications
      </h1>
      <AdminApplicationsClient initialApplications={applications} />
    </div>
  );
}
