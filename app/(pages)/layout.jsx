"use client";

import UILoading from "@/components/loading/UILoading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PagesLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <UILoading />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      {children}
    </div>
  );
}
