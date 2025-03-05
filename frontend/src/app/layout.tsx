import "~/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "~/components/theme-provider"
import type React from "react"
import Providers from "./_providers/providers"
import { Toaster } from "~/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "ProjectName - <ProjectName>",
    description: "",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Providers>
                        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
                            {children}
                        </div>
                        <Toaster />
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    )
}

