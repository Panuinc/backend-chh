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

export default function CustomersTestPage() {
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);

  const [customerId, setCustomerId] = useState("");
  const [displayName, setDisplayName] = useState("");

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
    getCustomers: () => safeFetch("/api/customers"),
    getCustomerById: () => safeFetch(`/api/customers/${customerId}`),
    getCustomerByName: () =>
      safeFetch(`/api/customers?displayName=${encodeURIComponent(displayName)}`),
  };

  async function run(fn) {
    setResponse(await fn());
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Test Customers API</h1>
      <p className="text-gray-600 mb-8">
        กดปุ่มด้านล่างเพื่อทดสอบ Customers API (Business Central)
      </p>

      {/* GET ALL */}
      <ApiBlock title="GET /api/customers">
        <button
          onClick={() => run(api.getCustomers)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try it
        </button>
      </ApiBlock>

      {/* GET BY ID */}
      <ApiBlock title="GET /api/customers/{customerId}">
        <input
          type="text"
          placeholder="customerId (GUID)"
          className="border p-2 rounded w-full"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <button
          onClick={() => run(api.getCustomerById)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try it
        </button>
      </ApiBlock>

      {/* GET BY DISPLAY NAME */}
      <ApiBlock title="GET /api/customers?displayName=...">
        <input
          type="text"
          placeholder="displayName"
          className="border p-2 rounded w-full"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button
          onClick={() => run(api.getCustomerByName)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
