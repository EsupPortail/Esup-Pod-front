"use client";

import type { BlockConfig } from "@/src/types";
import LiveBlockComponent from "../WebTV/LiveBlockComponent";
import CollectionBlockComponent from "../WebTV/CollectionBlockComponent";
import VideoGridBlockComponent from "../WebTV/VideoGridBlockComponent";
import CustomTextBlock from "./CustomTextBlock";

interface BlockRendererProps {
  block: BlockConfig;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block || !block.is_active) return null;

  const id = block.frontend_id?.toLowerCase() ?? "";

  if (
    block.frontend_id === "webtv-hero-direct" ||
    block.frontend_id === "live-block" ||
    id.includes("live") ||
    id.includes("direct")
  ) {
    return <LiveBlockComponent block={block} />;
  }

  if (
    block.frontend_id === "collection-block" ||
    id.includes("collection") ||
    id.includes("channel") ||
    id.includes("theme") ||
    id.includes("playlist")
  ) {
    return <CollectionBlockComponent block={block} />;
  }

  if (
    block.frontend_id === "custom-text-block" ||
    id.includes("text") ||
    id.includes("custom") ||
    id.includes("html")
  ) {
    return <CustomTextBlock block={block} />;
  }

  return <VideoGridBlockComponent block={block} />;
}
