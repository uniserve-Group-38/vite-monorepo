import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "@/lib/prisma"//your prisma instance






export const auth = betterAuth({
  database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    
    emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: { 
      google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  }, 
});

export interface UserPayload {
  id: string;
  email?: string;
}

export async function verifyUser(token: string): Promise<UserPayload | null> {
  try {
    // your logic
    return null;
  } catch {
    return null;
  }
}

