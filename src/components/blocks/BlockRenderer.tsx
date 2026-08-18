"use client";

import React from "react";
import type { BlockConfig } from "@/src/types";
import { resolveBlockComponent } from "./BlockRegistry";

interface BlockRendererProps {
  block: BlockConfig;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block || !block.is_active) {
    return null;
  }

  const Component = resolveBlockComponent(block.frontend_id);

  return <Component block={block} />;
}
