"use client";

import { SquareMinus } from "lucide-react";
import { Button, Input } from "@heroui/react";
import UIHeader from "../header/UIHeader";

export default function UIUser({
  HeaderText,
  apiItems,
  expanded,
  setExpanded,
  response,
  status,
  formatSwaggerStyle,
  ColorJson,
  userId,
  setUserId,
  api,
}) {
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

  function renderForm(item) {
    switch (item.key) {
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
              disabled={!userId.trim()}
            >
              Test
            </Button>
          </>
        );
      case "createUser":
        return (
          <>
            {renderInputs(item.fields, item.formState)}
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
            {renderInputs(item.fields, item.formState)}
            <Button
              color="warning"
              className="text-white font-semibold"
              onPress={api.updateUser}
              disabled={!userId.trim()}
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
      <UIHeader text={HeaderText} />
      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full p-2 gap-2 overflow-auto">
        <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
          {apiItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col w-full p-2 gap-2 rounded-xl border-1 border-${item.color}`}
            >
              <div className="flex flex-row items-center justify-center w-full h-full gap-2">
                <div
                  className={`flex items-center justify-start w-24 h-full p-2 gap-2 text-white text-md font-semibold rounded-xl border-1 border-${item.color} bg-${item.color}`}
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
                  {renderForm(item)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-start w-full h-full p-2 gap-2 text-white bg-dark rounded-xl overflow-auto">
          <pre>Status: {status ?? "—"}</pre>
          <pre className="w-full overflow-auto">
            {response ? (
              <ColorJson data={formatSwaggerStyle(response)} />
            ) : (
              "👉 Run an API to see response"
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
