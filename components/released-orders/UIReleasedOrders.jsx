"use client";
import { useState } from "react";

function ApiBlock({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-6 space-y-3 overflow-auto flex flex-col items-center justify-start w-full">
      <h2 className="font-mono text-lg text-blue-700">{title}</h2>
      {children}
    </div>
  );
}

export default function UIReleasedOrders() {
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);

  const [orderNo, setOrderNo] = useState("");

  async function safeFetch(url, options = {}) {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setStatus(res.status);
      return res.ok ? data : { error: `HTTP ${res.status}`, details: data };
    } catch (err) {
      setStatus("fail");
      return { error: "Fetch failed", details: err.message };
    }
  }

  const api = {
    getOrders: () => safeFetch("/api/released-orders"),
    getOrderByQuery: () =>
      safeFetch(`/api/released-orders?No=${encodeURIComponent(orderNo)}`),
    getOrderById: () => safeFetch(`/api/released-orders/${orderNo}`),
  };

  async function run(fn) {
    setResponse(await fn());
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Test Released Orders API</h1>
      <p className="text-gray-600 mb-8">
        กดปุ่มด้านล่างเพื่อทดสอบ Released_Production_Order_Excel API (Business Central)
      </p>

      {/* GET ALL */}
      <ApiBlock title="GET /api/released-orders">
        <button
          onClick={() => run(api.getOrders)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try it
        </button>
      </ApiBlock>

      {/* GET BY QUERY (No) */}
      <ApiBlock title="GET /api/released-orders?No=...">
        <input
          type="text"
          placeholder="Order No"
          className="border p-2 rounded w-full"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
        />
        <button
          onClick={() => run(api.getOrderByQuery)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try it
        </button>
      </ApiBlock>

      {/* GET BY ID (Dynamic route) */}
      <ApiBlock title="GET /api/released-orders/{orderNo}">
        <input
          type="text"
          placeholder="Order No"
          className="border p-2 rounded w-full"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
        />
        <button
          onClick={() => run(api.getOrderById)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try it
        </button>
      </ApiBlock>

      {/* OUTPUT */}
      <div className="bg-black text-green-400 p-4 rounded-lg mt-8 overflow-x-auto text-sm w-full">
        <pre>Status: {status ?? "—"}</pre>
        <pre>
          {response
            ? JSON.stringify(response, null, 2)
            : "👉 Run an API above to see response"}
        </pre>
      </div>
    </div>
  );
}
