"use client";

import React, { useState } from "react";
import UIUser from "@/components/user/UIUser";

function formatSwaggerStyle(obj) {
  if (Array.isArray(obj)) return obj.map((item) => formatSwaggerStyle(item));
  if (!obj || typeof obj !== "object") return obj;
  const formatted = {};
  for (const [key, val] of Object.entries(obj)) {
    const type = Array.isArray(val)
      ? "Array"
      : val === null
      ? "Null"
      : typeof val === "object"
      ? "Object"
      : typeof val;
    formatted[`${key} ${type}`] = formatSwaggerStyle(val);
  }
  return formatted;
}

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
            <span style={{ color: "#FFFFFF" }}>"{k}"</span>
            <span style={{ color: "#FFFFFF" }}> : </span>
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

function useFormState(initial) {
  const [form, setForm] = useState(initial);
  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });
  return { form, setForm, handleChange };
}

export default function User() {
  const [expanded, setExpanded] = useState(null);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState("");

  const newUser = useFormState({
    userEmail: "",
    userPassword: "",
    userFirstname: "",
    userLastname: "",
  });
  const updateUser = useFormState({
    userEmail: "",
    userPassword: "",
    userFirstname: "",
    userLastname: "",
  });

  async function safeFetch(url, options = {}) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN || "Develop", // ใช้ env
        },
      });
      let data = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
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
    getUserById: () => {
      if (!userId || userId.trim() === "") {
        setStatus(400);
        setResponse({ error: "Missing userId" });
        return;
      }
      return safeFetch(`/api/users/${Number(userId)}`);
    },
    createUser: () =>
      safeFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(newUser.form),
      }),
    updateUser: () => {
      if (!userId || userId.trim() === "") {
        setStatus(400);
        setResponse({ error: "Missing userId" });
        return;
      }
      return safeFetch(`/api/users/${Number(userId)}`, {
        method: "PUT",
        body: JSON.stringify(updateUser.form),
      });
    },
  };

  const apiItems = [
    { method: "Get", label: "User All", color: "primary", key: "getUsers" },
    {
      method: "Get",
      label: "User By ID",
      color: "primary",
      key: "getUserById",
    },
    {
      method: "Post",
      label: "User Create",
      color: "success",
      key: "createUser",
      fields: ["userEmail", "userPassword", "userFirstname", "userLastname"],
      formState: newUser,
    },
    {
      method: "Put",
      label: "User Update",
      color: "warning",
      key: "updateUser",
      fields: ["userEmail", "userPassword", "userFirstname", "userLastname"],
      formState: updateUser,
    },
  ];

  return (
    <UIUser
      HeaderText="User"
      apiItems={apiItems}
      expanded={expanded}
      setExpanded={setExpanded}
      response={response}
      status={status}
      formatSwaggerStyle={formatSwaggerStyle}
      ColorJson={ColorJson}
      userId={userId}
      setUserId={setUserId}
      api={api}
    />
  );
}
