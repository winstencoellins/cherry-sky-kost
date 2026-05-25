"use client";

import { useCallback, useState } from "react";

export function useDeleteDialog<T>() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const openDelete = useCallback((target: T) => {
    setItem(target);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setItem(null);
  }, []);

  return { open, setOpen, item, openDelete, close };
}
