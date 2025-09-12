"use client";

import { Home, SquareMinus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@heroui/react";

const userFieldMeta = {
  userId: { type: "String", location: "path" },
  userEmail: { type: "String", location: "formData" },
  userPassword: { type: "String", location: "formData" },
  userFirstName: { type: "String", location: "formData" },
  userLastName: { type: "String", location: "formData" },
};

function formatSwaggerStyle(obj, meta) {
  if (Array.isArray(obj)) {
    return obj.map((item) => formatSwaggerStyle(item, meta));
  }
  if (!obj || typeof obj !== "object") return obj;

  const formatted = {};
  for (const [key, val] of Object.entries(obj)) {
    const { type } = meta[key] || { type: typeof val };
    const label = `${key} ${type}`;
    formatted[label] = val;
  }
  return formatted;
}

const colorClasses = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function ColorJson({ data, indent = 2 }) {
  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: indent }}>
        [
        {data.map((v, i) => (
          <div key={i}>
            <ColorJson data={v} indent={indent + 2} />
          </div>
        ))}
        ]
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    return (
      <div style={{ marginLeft: indent }}>
        {"{"}
        {Object.entries(data).map(([k, v], i) => (
          <div key={i} style={{ marginLeft: 16 }}>
            <span style={{ color: "#FCB8D9" }}>"{k}"</span>
            <span style={{ color: "#ffffff" }}> : </span>
            <span style={{ color: "lightgreen" }}>
              <ColorJson data={v} indent={indent + 2} />
            </span>
          </div>
        ))}
        {"}"}
      </div>
    );
  }

  return <span style={{ color: "lightgreen" }}>{String(data)}</span>;
}

const apiItems = [
  { method: "Get", label: "User All", color: "primary", key: "getUsers" },
  { method: "Get", label: "User By ID", color: "primary", key: "getUserById" },
  {
    method: "Get",
    label: "User By Name",
    color: "primary",
    key: "getUserByName",
  },
  { method: "Post", label: "User Create", color: "success", key: "createUser" },
  { method: "Put", label: "User Update", color: "warning", key: "updateUser" },
  {
    method: "Delete",
    label: "User Delete",
    color: "danger",
    key: "deleteUser",
  },
];

export default function UIUser() {
  const [expanded, setExpanded] = useState(null);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);

  const [userId, setUserId] = useState("");
  const [newUser, setNewUser] = useState({
    userEmail: "",
    userPassword: "",
    userFirstName: "",
    userLastName: "",
  });
  const [updateUser, setUpdateUser] = useState({
    userEmail: "",
    userPassword: "",
    userFirstName: "",
    userLastName: "",
  });

  async function safeFetch(url, options = {}) {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setStatus(res.status);
      setResponse(
        res.ok ? data : { error: `HTTP ${res.status}`, details: data }
      );
    } catch (err) {
      setStatus("fail");
      setResponse({ error: "Fetch failed", details: err.message });
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

  function renderForm(key) {
    switch (key) {
      case "getUsers":
        return (
          <Button
            color="primary"
            className="text-white font-semibold"
            onPress={api.getUsers}
          >
            Test
          </Button>
        );
      case "getUserById":
        return (
          <>
            <input
              className="border p-2 rounded w-full"
              placeholder="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button
              color="primary"
              className="text-white font-semibold"
              onPress={api.getUserById}
            >
              Test
            </Button>
          </>
        );
      case "createUser":
        return (
          <>
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
              type="password"
              placeholder="userPassword"
              className="border p-2 rounded w-full"
              value={newUser.userPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, userPassword: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="userFirstName"
              className="border p-2 rounded w-full"
              value={newUser.userFirstName}
              onChange={(e) =>
                setNewUser({ ...newUser, userFirstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="userLastName"
              className="border p-2 rounded w-full"
              value={newUser.userLastName}
              onChange={(e) =>
                setNewUser({ ...newUser, userLastName: e.target.value })
              }
            />
            <Button
              color="success"
              className="text-white font-semibold"
              onPress={api.createUser}
            >
              Test
            </Button>
          </>
        );
      case "updateUser":
        return (
          <>
            <input
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
              type="password"
              placeholder="userPassword"
              className="border p-2 rounded w-full"
              value={updateUser.userPassword}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, userPassword: e.target.value })
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
            <input
              type="text"
              placeholder="userLastName"
              className="border p-2 rounded w-full"
              value={updateUser.userLastName}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, userLastName: e.target.value })
              }
            />
            <Button
              color="warning"
              className="text-white font-semibold"
              onPress={api.updateUser}
            >
              Test
            </Button>
          </>
        );
      case "deleteUser":
        return (
          <>
            <input
              placeholder="userId"
              className="border p-2 rounded w-full"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button
              color="danger"
              className="text-white font-semibold"
              onPress={api.deleteUser}
            >
              Test
            </Button>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-2">
      <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-b-1 border-default">
        <Link
          href="/home"
          className="flex items-center justify-center h-full p-2 gap-2"
        >
          <Home />
        </Link>
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-xl font-semibold">
          API Documents : User
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full p-2 gap-2 overflow-auto">
        <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
          <div className="flex flex-col items-center justify-center w-full h-fit gap-2">
            {apiItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col w-full gap-2 rounded-xl border-1 border-${item.color}`}
              >
                <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
                  <div
                    className={`flex items-center justify-start w-24 h-full p-2 gap-2 text-white text-md font-semibold rounded-xl border-1 border-${
                      item.color
                    } ${colorClasses[item.color]}`}
                  >
                    {item.method}
                  </div>
                  <div className="flex items-center justify-start w-full h-full p-2 gap-2">
                    {item.label}
                  </div>
                  <div
                    className="flex items-center justify-center h-full p-2 gap-2 cursor-pointer"
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <SquareMinus />
                  </div>
                </div>

                {expanded === idx && (
                  <div className="flex flex-col items-end justify-start w-full h-fit p-2 gap-2">
                    {renderForm(item.key)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-start w-full h-full p-2 gap-2 bg-dark text-secondary rounded-xl overflow-auto">
          <pre>Status: {status ?? "—"}</pre>
          <pre className="w-full overflow-auto">
            {response ? (
              <ColorJson data={formatSwaggerStyle(response, userFieldMeta)} />
            ) : (
              "👉 Run an API to see response"
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
