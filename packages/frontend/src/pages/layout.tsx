import "./global.css"

// This file is kept for compatibility only.
// Font loading is handled via Google Fonts link in index.html.
// Auth providers and layout are handled by App.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
