import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { Link } from "react-router-dom"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params

    return (
        <main className="flex grow flex-col items-center justify-center gap-4 self-center p-4 md:p-6">
            <div className="w-full max-w-sm border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <AuthView path={path} />
            </div>

            {!["callback", "sign-out"].includes(path) && (
                <p className="w-3xs text-center font-bold text-xs">
                    By continuing, you agree to our{" "}
                    <Link
                        className="underline font-black"
                        to="/terms"
                        target="_blank"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        className="underline font-black"
                        to="/privacy"
                        target="_blank"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            )}
        </main>
    )
}