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

export default function DocsPage() {
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);

  const [userId, setUserId] = useState("");
  const [newUser, setNewUser] = useState({ userEmail: "", userFirstName: "" });
  const [updateUser, setUpdateUser] = useState({ userEmail: "", userFirstName: "" });

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
    getUsers: () => safeFetch("/api/users"),
    createUser: () =>
      safeFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }),
    getUserById: () => safeFetch(`/api/users/${userId}`),
    updateUser: () =>
      safeFetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateUser),
      }),
    deleteUser: () => safeFetch(`/api/users/${userId}`, { method: "DELETE" }),
  };

  async function run(fn) {
    setResponse(await fn());
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Interactive API Docs</h1>
      <p className="text-gray-600 mb-8">
        กดปุ่มด้านล่างเพื่อทดสอบ API ได้เหมือน Swagger
      </p>

      <ApiBlock title="GET /api/users">
        <button
          onClick={() => run(api.getUsers)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try it
        </button>
      </ApiBlock>

      <ApiBlock title="POST /api/users">
        <input
          type="email"
          placeholder="userEmail"
          className="border p-2 rounded w-full"
          value={newUser.userEmail}
          onChange={(e) =>
            setNewUser({ ...newUser, userEmail: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="userFirstName"
          className="border p-2 rounded w-full"
          value={newUser.userFirstName}
          onChange={(e) => setNewUser({ ...newUser, userFirstName: e.target.value })}
        />
        <button
          onClick={() => run(api.createUser)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try it
        </button>
      </ApiBlock>

      <ApiBlock title="GET /api/users/{userId}">
        <input
          type="text"
          placeholder="userId"
          className="border p-2 rounded w-full"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          onClick={() => run(api.getUserById)}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Try it
        </button>
      </ApiBlock>

      <ApiBlock title="PUT /api/users/{userId}">
        <input
          type="text"
          placeholder="userId"
          className="border p-2 rounded w-full"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="email"
          placeholder="userEmail"
          className="border p-2 rounded w-full"
          value={updateUser.userEmail}
          onChange={(e) =>
            setUpdateUser({ ...updateUser, userEmail: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="userFirstName"
          className="border p-2 rounded w-full"
          value={updateUser.userFirstName}
          onChange={(e) =>
            setUpdateUser({ ...updateUser, userFirstName: e.target.value })
          }
        />
        <button
          onClick={() => run(api.updateUser)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try it
        </button>
      </ApiBlock>

      <ApiBlock title="DELETE /api/users/{userId}">
        <input
          type="text"
          placeholder="userId"
          className="border p-2 rounded w-full"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          onClick={() => run(api.deleteUser)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try it
        </button>
      </ApiBlock>

      <div className="bg-black text-green-400 p-4 rounded-lg mt-8 overflow-x-auto text-sm">
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
