"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "@/lib/fonts/THSarabunNew"; // ✅ import ฟอนต์ไทย

export default function CoverPage() {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  async function handleSearch(value) {
    setQuery(value);

    if (value.length < 2) {
      setCustomers([]);
      return;
    }

    try {
      const res = await fetch(`/api/customers?displayName=${encodeURIComponent(value)}`);
      const data = await res.json();
      setCustomers(data.value || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  }

  function handleGeneratePDF() {
    if (!selectedCustomer) return;

    const doc = new jsPDF();

    // ✅ ใช้ฟอนต์ไทย
    doc.setFont("THSarabunNew");
    doc.setFontSize(18);
    doc.text("ใบปะหน้าซอง", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text(`ชื่อบริษัท: ${selectedCustomer.displayName || ""}`, 20, 50);
    doc.text(`ที่อยู่: ${selectedCustomer.addressLine1 || ""}`, 20, 60);
    doc.text(`โทร: ${selectedCustomer.phoneNumber || ""}`, 20, 70);
    doc.text(`เลขผู้เสียภาษี: ${selectedCustomer.taxRegistrationNumber || ""}`, 20, 80);

    doc.save(`cover-${selectedCustomer.number || "customer"}.pdf`);
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">ทำใบปะหน้าซอง</h1>

      {/* Input Search */}
      <input
        type="text"
        placeholder="พิมพ์ชื่อบริษัทลูกค้า..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Dropdown Results */}
      {customers.length > 0 && (
        <ul className="border rounded max-h-60 overflow-y-auto">
          {customers.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setSelectedCustomer(c);
                setCustomers([]);
                setQuery(c.displayName);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {c.displayName}
            </li>
          ))}
        </ul>
      )}

      {/* Show Selected Customer */}
      {selectedCustomer && (
        <div className="border p-4 rounded bg-gray-50">
          <p><b>บริษัท:</b> {selectedCustomer.displayName}</p>
          <p><b>ที่อยู่:</b> {selectedCustomer.addressLine1}</p>
          <p><b>โทร:</b> {selectedCustomer.phoneNumber}</p>
          <p><b>เลขผู้เสียภาษี:</b> {selectedCustomer.taxRegistrationNumber}</p>
        </div>
      )}

      {/* Button PDF */}
      <button
        onClick={handleGeneratePDF}
        disabled={!selectedCustomer}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        สร้าง PDF
      </button>
    </div>
  );
}
