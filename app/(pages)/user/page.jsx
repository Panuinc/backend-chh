"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
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
    userFirstName: "",
    userLastName: "",
  });
  const updateUser = useFormState({
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
    getUserById: () => safeFetch(`/api/users/${userId}`),
    createUser: () =>
      safeFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser.form),
      }),
    updateUser: () =>
      safeFetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateUser.form),
      }),
    deleteUser: () => safeFetch(`/api/users/${userId}`, { method: "DELETE" }),
  };

  function renderInputs(fields, state) {
    return fields.map((field) => (
      <Input
        key={field}
        name={field}
        type={field.toLowerCase().includes("password") ? "password" : "text"}
        label={field}
        labelPlacement="outside"
        placeholder={field}
        variant="bordered"
        isRequired
        value={state.form[field]}
        onChange={state.handleChange(field)}
      />
    ));
  }

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
            <Input
              name="userId"
              type="text"
              label="userId"
              labelPlacement="outside"
              placeholder="userId"
              variant="bordered"
              isRequired
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
            {renderInputs(
              ["userEmail", "userPassword", "userFirstName", "userLastName"],
              newUser
            )}
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
            <Input
              name="userId"
              type="text"
              label="userId"
              labelPlacement="outside"
              placeholder="userId"
              variant="bordered"
              isRequired
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            {renderInputs(
              ["userEmail", "userPassword", "userFirstName", "userLastName"],
              updateUser
            )}
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
            <Input
              name="userId"
              type="text"
              label="userId"
              labelPlacement="outside"
              placeholder="userId"
              variant="bordered"
              isRequired
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
    <UIUser
      HeaderText="User"
      apiItems={apiItems}
      expanded={expanded}
      setExpanded={setExpanded}
      renderForm={renderForm}
      response={response}
      status={status}
      formatSwaggerStyle={formatSwaggerStyle}
      ColorJson={ColorJson}
    />
  );
}
