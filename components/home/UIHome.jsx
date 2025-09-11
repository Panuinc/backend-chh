import Link from "next/link";
import React from "react";

const links = [
  { href: "/user", label: "API : User" },
  { href: "/customers", label: "API : Customers" },
  { href: "/orders", label: "API : Orders" },
  { href: "/products", label: "API : Products" },
];

export default function UIHome() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
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
      </div>
    </>
  );
}
