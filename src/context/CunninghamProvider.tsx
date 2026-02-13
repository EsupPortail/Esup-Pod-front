"use client";

import { CunninghamProvider } from "@openfun/cunningham-react";

export default function CunninghamStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CunninghamProvider>{children}</CunninghamProvider>;
}
