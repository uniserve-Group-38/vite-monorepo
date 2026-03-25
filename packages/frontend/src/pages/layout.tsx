import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./global.css";
import { Toaster } from "@/components/ui/sonner"
import BetterAuthUIProvider from "@/providers/better-auth-ui-provider"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});



// Forced HMR update for CSS changes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <BetterAuthUIProvider>
            {children}
          </BetterAuthUIProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
