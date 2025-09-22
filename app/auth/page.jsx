"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import UILoading from "@/components/loading/UILoading";
import UIAuth from "@/components/auth/UIAuth";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [status, session, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) toast.success("Login successful!");
    else toast.error(res?.error || "Login failed.");
  };

  return (
    <>
      <Toaster position="top-right" />
      {status === "loading" ? (
        <UILoading />
      ) : (
        <UIAuth
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
    </>
  );
}
