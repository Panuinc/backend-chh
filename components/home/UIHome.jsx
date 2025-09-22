"use client"

import Link from "next/link"
import React from "react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@heroui/react"

const links = [
  { href: "/user", label: "API : User" },
  { href: "/customers", label: "API : Customers" },
  { href: "/orders", label: "API : Orders" },
  { href: "/products", label: "API : Products" },
]

export default function UIHome() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          ipAddress: null,
          userAgent: navigator.userAgent,
        }),
      })
    } catch (e) {
      console.error("Logout API failed", e)
    } finally {
      await signOut({ callbackUrl: "/auth" })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
        <div className="relative flex items-center justify-center w-full h-full p-2 gap-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xl font-semibold">
            Comprehensive API Documentation and Integration Guide
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-center w-full h-full p-2 gap-2">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="flex items-center justify-center min-w-48 min-h-28 p-2 gap-2 border-1 border-default bg-white/50 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center w-full h-fit p-2">
        <Button color="danger" onPress={handleLogout} className="px-6">
          Logout
        </Button>
      </div>
    </div>
  )
}
