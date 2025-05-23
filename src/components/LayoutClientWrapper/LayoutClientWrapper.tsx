"use client";

import { ReactNode } from "react";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { useLoadingStore } from "@/stores/loadingStore";

export default function LayoutClientWrapper({ children }: { children: ReactNode }) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      <LoadingOverlay show={isLoading} />
      {children}
    </>
  );
}
