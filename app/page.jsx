"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <Button color="primary">
      <Link href="/user">User</Link>
    </Button>
  );
}
