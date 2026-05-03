"use client";

import { useEffect, useState } from "react";
import { subscribe } from "./repo";

export function useStore<T>(selector: () => T): T {
  const [value, setValue] = useState<T>(() => selector());
  useEffect(() => {
    setValue(selector());
    const unsub = subscribe(() => setValue(selector()));
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
