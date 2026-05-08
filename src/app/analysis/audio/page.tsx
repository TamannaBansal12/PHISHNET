"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScanStore } from "@/store/scanStore";

export default function AudioRedirect() {
  const router = useRouter();
  const setActivePage = useScanStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage('audio');
    router.replace('/dashboard');
  }, [router, setActivePage]);

  return null;
}
