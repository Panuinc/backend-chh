"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "@/lib/fonts/THSarabunNew";

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
      const res = await fetch(
        `/api/customers?displayName=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setCustomers(data.value || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  }

  function handleGeneratePDF() {
    if (!selectedCustomer) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [23.2, 10.8],
    });

    doc.setFont("THSarabunNew");
    doc.setFontSize(18);

    // ---------- ซ้ายบน: บริษัทคุณ ----------
    let xLeft = 2;
    let yTop = 2;
    doc.text("บริษัท ชื้อฮะฮวด อุตสาหกรรม จำกัด", xLeft, yTop);
    doc.text("9/1 หมู่2 ถนน บางเลน-ลาดหลุมแก้ว", xLeft, yTop + 0.8);
    doc.text(
      "ตำบลขุนศรี อำเภอไทรน้อย จังหวัด นนทบุรี 11150",
      xLeft,
      yTop + 1.6
    );
    doc.text("(091-7945581 อันบัญชี)", xLeft, yTop + 2.4);

    // ---------- ขวาล่าง: Customer ----------
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let xRight = pageWidth - 10; // margin ขวา
    let yBottom = pageHeight - 4; // margin ล่าง

    doc.text(`บริษัท: ${selectedCustomer.displayName || ""}`, xRight, yBottom);
    doc.text(`${selectedCustomer.addressLine1 || ""}`, xRight, yBottom + 0.8);
    if (selectedCustomer.addressLine2) {
      doc.text(`${selectedCustomer.addressLine2}`, xRight, yBottom + 1.6);
    }
    doc.text(
      `โทร: ${selectedCustomer.phoneNumber || ""}`,
      xRight,
      yBottom + 2.4
    );

    if (selectedCustomer.department) {
      doc.setTextColor(200, 0, 0);
      doc.text(
        `ฝ่ายจัดซื้อ: ${selectedCustomer.department}`,
        xRight,
        yBottom + 3.2
      );
      doc.setTextColor(0, 0, 0);
    }

    doc.save(`cover-${selectedCustomer.number || "customer"}.pdf`);
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">ทำใบปะหน้าซอง</h1>

      <input
        type="text"
        placeholder="พิมพ์ชื่อบริษัทลูกค้า..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {customers.length > 0 && (
        <ul className="border rounded max-h-60 overflow-y-auto">
          {customers.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setSelectedCustomer({ ...c });
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

      {selectedCustomer && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <p>
            <b>บริษัท:</b> {selectedCustomer.displayName}
          </p>
          <label className="block">
            <b>ที่อยู่:</b>
            <input
              type="text"
              value={selectedCustomer.addressLine1 || ""}
              onChange={(e) =>
                setSelectedCustomer({
                  ...selectedCustomer,
                  addressLine1: e.target.value,
                })
              }
              className="w-full border p-1 rounded mt-1"
            />
          </label>
          {selectedCustomer.addressLine2 && (
            <label className="block">
              <b>ที่อยู่บรรทัด 2:</b>
              <input
                type="text"
                value={selectedCustomer.addressLine2 || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    addressLine2: e.target.value,
                  })
                }
                className="w-full border p-1 rounded mt-1"
              />
            </label>
          )}
          <p>
            <b>โทร:</b> {selectedCustomer.phoneNumber}
          </p>
          <p>
            <b>เลขผู้เสียภาษี:</b> {selectedCustomer.taxRegistrationNumber}
          </p>
          {selectedCustomer.department && (
            <p>
              <b>ฝ่ายจัดซื้อ:</b>{" "}
              <span className="text-red-600">
                {selectedCustomer.department}
              </span>
            </p>
          )}
        </div>
      )}

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
