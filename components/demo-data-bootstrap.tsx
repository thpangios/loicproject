"use client";

import { useEffect } from "react";
import { ensureDemoData } from "@/lib/db/repo";

export function DemoDataBootstrap() {
  useEffect(() => {
    ensureDemoData();
  }, []);

  return null;
}
