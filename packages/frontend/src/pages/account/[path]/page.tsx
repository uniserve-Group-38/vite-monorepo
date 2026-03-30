import { AccountView } from "@daveyplate/better-auth-ui"
import { useParams } from "react-router-dom"

export default function AccountPage() {
    const { path } = useParams<{ path: string }>()

    if (!path) return null


    return (
        <main className="container self-center p-4  md:p-6">
            <AccountView
                path={path}
                classNames={{
                    sidebar: {
                        base: "sticky top-20"
                    }
                }}
            />
        </main>
    )
}