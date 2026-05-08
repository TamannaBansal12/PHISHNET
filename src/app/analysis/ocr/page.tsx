"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScanStore } from "@/store/scanStore";

export default function OCRRedirect() {
  const router = useRouter();
  const setActivePage = useScanStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage('ocr');
    router.replace('/dashboard');
  }, [router, setActivePage]);

  return null;
}
