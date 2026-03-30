import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: import.meta.env.VITE_API_URL
})

type CustomSession = {
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    };
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        emailVerified: boolean;
        image?: string | null;
        role?: string;
    };
}

export const { signIn, signUp, signOut } = authClient

export const useSession = () => {
    return authClient.useSession() as unknown as {
        data: CustomSession | null | undefined;
        isPending: boolean;
        error: any;
        refetch: () => Promise<void>;
    }
}