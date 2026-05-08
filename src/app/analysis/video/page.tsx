"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScanStore } from "@/store/scanStore";

export default function VideoRedirect() {
  const router = useRouter();
  const setActivePage = useScanStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage('video');
    router.replace('/dashboard');
  }, [router, setActivePage]);

  return null;
}
