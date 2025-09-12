"use client";

import Link from "next/link";
import React from "react";
import { Home } from "lucide-react";

export default function UIHeader({ text }) {
  return (
    <>
      <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-b-1 border-default">
        <Link
          href="/home"
          className="flex items-center justify-center h-full p-2 gap-2"
        >
          <Home />
        </Link>
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-xl font-semibold">
          API Documents : {text}
        </div>
      </div>
    </>
  );
}
