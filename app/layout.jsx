import { Geist, Geist_Mono } from "next/font/google"
import "@/style/globals.css"
import { Providers } from "./providers"
import { SessionProviders } from "./sessionProvider"
import { Toaster } from "react-hot-toast"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Backend CHH",
  description: "All Backend For CHH",
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/home")
  }

  return (
    <SessionProviders>
      <html lang="en">
        <head>
          <link rel="icon" href="/logoCompany/logoCompany_1.png" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <Toaster position="top-right" />
            <div className="flex items-center justify-center w-full h-screen gap-2 bg-white text-dark">
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </SessionProviders>
  )
}
