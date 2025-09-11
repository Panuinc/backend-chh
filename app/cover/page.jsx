"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import "@/lib/fonts/THSarabunNew"

export default function CoverPage() {
  const [query, setQuery] = useState("")
  const [customers, setcustomers] = useState([])
  const [selectedcustomers, setSelectedcustomers] = useState(null)
  const [recipient, setRecipient] = useState("")
  const [docTitle, setDocTitle] = useState("")

  const handleSearch = async (value) => {
    setQuery(value)
    if (value.length < 2) {
      setcustomers([])
      return
    }
    try {
      const res = await fetch(`/api/customers?displayName=${encodeURIComponent(value)}`)
      const data = await res.json()
      setcustomers(data.value || [])
    } catch (err) {
      console.error("Search failed", err)
    }
  }

  const handleGeneratePDF = () => {
    if (!selectedcustomers) return
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [23.2, 10.8],
    })
    doc.setFont("THSarabunNew")
    doc.setFontSize(14)

    doc.text("บริษัท ชื้อฮะฮวด อุตสาหกรรม จำกัด", 2, 2)
    doc.text("9/1 หมู่2 ถนน บางเลน-ลาดหลุมแก้ว", 2, 2.8)
    doc.text("ตำบลขุนศรี อำเภอไทรน้อย จังหวัด นนทบุรี 11150", 2, 3.6)
    doc.text("(091-7945581 อันบัญชี)", 2, 4.4)

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 2
    const yStart = pageHeight - 5
    const xRight = pageWidth - 10

    const info = [
      `บริษัท: ${selectedcustomers.displayName || ""}`,
      `${selectedcustomers.addressLine1 || ""}`,
      selectedcustomers.addressLine2 || "",
      `โทร: ${selectedcustomers.phoneNumber || ""}`,
    ]
    if (recipient) info.push(`เรียน: ${recipient}`)
    if (docTitle) info.push(docTitle)

    info.forEach((line, i) => {
      if (line) {
        if (docTitle && line === docTitle) doc.setTextColor(200, 0, 0)
        doc.text(line, xRight, yStart + i * 0.8, { align: "left" })
        doc.setTextColor(0, 0, 0)
      }
    })

    const safeName = (selectedcustomers.displayName || "customers").replace(
      /[^\u0E00-\u0E7Fa-zA-Z0-9-_]/g,
      "_"
    )
    doc.save(`cover-${safeName}.pdf`)
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
                setSelectedcustomers({ ...c })
                setcustomers([])
                setQuery(c.displayName)
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {c.displayName}
            </li>
          ))}
        </ul>
      )}
      {selectedcustomers && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <p>
            <b>บริษัท:</b> {selectedcustomers.displayName}
          </p>
          <label className="block">
            <b>ที่อยู่:</b>
            <input
              type="text"
              value={selectedcustomers.addressLine1 || ""}
              onChange={(e) =>
                setSelectedcustomers({
                  ...selectedcustomers,
                  addressLine1: e.target.value,
                })
              }
              className="w-full border p-1 rounded mt-1"
            />
          </label>
          {selectedcustomers.addressLine2 && (
            <label className="block">
              <b>ที่อยู่บรรทัด 2:</b>
              <input
                type="text"
                value={selectedcustomers.addressLine2 || ""}
                onChange={(e) =>
                  setSelectedcustomers({
                    ...selectedcustomers,
                    addressLine2: e.target.value,
                  })
                }
                className="w-full border p-1 rounded mt-1"
              />
            </label>
          )}
          <p>
            <b>โทร:</b> {selectedcustomers.phoneNumber}
          </p>
          <p>
            <b>เลขผู้เสียภาษี:</b> {selectedcustomers.taxRegistrationNumber}
          </p>
          <label className="block">
            <b>เรียน (ผู้รับ):</b>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border p-1 rounded mt-1"
              placeholder="เช่น บัญชี การเงิน จัดซื้อ"
            />
          </label>
          <label className="block">
            <b>หัวข้อเอกสาร:</b>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full border p-1 rounded mt-1 text-red-600"
              placeholder="เช่น เอกสารวางบิล ใบกำกับภาษี"
            />
          </label>
        </div>
      )}
      <button
        onClick={handleGeneratePDF}
        disabled={!selectedcustomers}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        สร้าง PDF
      </button>
    </div>
  )
}
