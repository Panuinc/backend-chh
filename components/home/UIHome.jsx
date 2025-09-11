import Link from "next/link";
import React from "react";

export default function UIHome() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark">
        <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark">
          <div className="relative flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-xl font-semibold">
              Comprehensive API Documentation and Integration Guide
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark">
          <Link
            href="/user"
            className="flex items-center justify-center min-w-48 min-h-28 p-2 gap-2 border-1 border-default bg-white/50 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            API : User
          </Link>
          <Link
            href="/customers"
            className="flex items-center justify-center min-w-48 min-h-28 p-2 gap-2 border-1 border-default bg-white/50 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            API : customers
          </Link>
        </div>
      </div>
    </>
  );
}
