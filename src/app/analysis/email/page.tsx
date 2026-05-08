"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScanStore } from "@/store/scanStore";

export default function EmailRedirect() {
  const router = useRouter();
  const setActivePage = useScanStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage('email');
    router.replace('/dashboard');
  }, [router, setActivePage]);

  return null;
}
