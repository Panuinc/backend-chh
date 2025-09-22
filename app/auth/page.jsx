"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import UILoading from "@/components/loading/UILoading";
import UIAuth from "@/components/auth/UIAuth";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.forceReset) {
        router.push("/force-password-change");
      } else {
        router.push("/overview");
      }
    }
  }, [status, session, router]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.ok) {
      toast.success("Login successful!");
    } else {
      const errMsg =
        res?.error || "An error occurred during login. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {status === "loading" ? (
        <UILoading />
      ) : (
        <UIAuth
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
    </>
  );
}
