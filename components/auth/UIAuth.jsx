"use client";

import { Button, Input } from "@heroui/react";
import React from "react";

export default function UIAuth() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full lg:w-4/12 h-[600px] p-2 gap-2 bg-white shadow-lg rounded-3xl">
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center text-xl font-semibold">
          Sign in to CHH Industry API
        </div>
        <div className="flex items-center justify-start w-full h-fit p-2 gap-2 text-center">
          Connect to your account to manage and monitor factory operations.
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Input
            name="Email"
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="xxx@xxx.com"
            variant="bordered"
            isRequired
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Input
            name="Password"
            type="password"
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            variant="bordered"
            isRequired
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Button color="primary" className="w-full">
            Signin
          </Button>
        </div>
      </div>
    </>
  );
}
