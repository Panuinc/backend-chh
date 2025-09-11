"use client";

import { Home, SquareMinus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const apiItems = [
  {
    method: "Get",
    label: "User All",
    color: "primary",
    doc: "แสดง Users ทั้งหมด",
  },
  {
    method: "Get",
    label: "User By ID",
    color: "primary",
    doc: "แสดง User ตาม ID",
  },
  {
    method: "Get",
    label: "User By Name",
    color: "primary",
    doc: "แสดง User ตาม Name",
  },
  {
    method: "Post",
    label: "User Create",
    color: "success",
    doc: "สร้าง User ใหม่",
  },
  {
    method: "Put",
    label: "User Update",
    color: "warning",
    doc: "แก้ไขข้อมูล User",
  },
  { method: "Delete", label: "User Delete", color: "danger", doc: "ลบ User" },
];

export default function UIUser() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-2">
      <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark">
        <Link
          href="/home"
          className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark"
        >
          <Home />
        </Link>
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark text-xl font-semibold">
          API Documents : user
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full p-2 gap-2 border-2 border-dark">
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark overflow-auto">
          <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark">
            {apiItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col w-full p-2 gap-2 border-2 border-dark"
              >
                <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark">
                  <div
                    className={`flex items-center justify-start w-24 h-full p-2 gap-2 text-white text-lg font-semibold rounded-xl border-1 border-${item.color} bg-${item.color}/75`}
                  >
                    {item.method}
                  </div>
                  <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark">
                    {item.label}
                  </div>
                  <div
                    className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark cursor-pointer"
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <SquareMinus />
                  </div>
                </div>

                {expanded === idx && (
                  <div className="flex flex-col items-start justify-start w-full h-fit p-2 gap-2 border-2 border-dashed border-dark bg-gray-100">
                    {item.doc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark rounded-xl">
          2
        </div>
      </div>
    </div>
  );
}
