import LiveBlockComponent from "../WebTV/LiveBlockComponent";
import CollectionBlockComponent from "../WebTV/CollectionBlockComponent";
import VideoGridBlockComponent from "../WebTV/VideoGridBlockComponent";
import CustomTextBlock from "./CustomTextBlock";

import { LiveBlockManifest } from "./manifests/LiveBlock.manifest";
import { CollectionBlockManifest } from "./manifests/CollectionBlock.manifest";
import { VideoGridBlockManifest } from "./manifests/VideoGridBlock.manifest";
import { CustomTextBlockManifest } from "./manifests/CustomTextBlock.manifest";

export interface BlockRegistration {
  component: React.ComponentType<any>;
  manifest: Record<string, any>;
}

export const blockRegistry: Record<string, BlockRegistration> = {
  "webtv-hero-direct": { component: LiveBlockComponent, manifest: LiveBlockManifest },
  "live-block": { component: LiveBlockComponent, manifest: LiveBlockManifest },
  "collection-block": { component: CollectionBlockComponent, manifest: CollectionBlockManifest },
  "video-grid-block": { component: VideoGridBlockComponent, manifest: VideoGridBlockManifest },
  "custom-text-block": { component: CustomTextBlock, manifest: CustomTextBlockManifest },
};

/**
 * Resolves the matching React component for a given frontend_id key.
 * Falls back to fuzzy matching pattern rules if explicit key is not found.
 */
export function resolveBlockComponent(frontendId: string): React.ComponentType<any> {
  if (blockRegistry[frontendId]) {
    return blockRegistry[frontendId].component;
  }

  const lowerId = frontendId.toLowerCase();
  if (lowerId.includes("live") || lowerId.includes("direct")) {
    return LiveBlockComponent;
  }
  if (lowerId.includes("collection") || lowerId.includes("channel") || lowerId.includes("theme") || lowerId.includes("playlist")) {
    return CollectionBlockComponent;
  }
  if (lowerId.includes("text") || lowerId.includes("custom") || lowerId.includes("html")) {
    return CustomTextBlock;
  }

  return VideoGridBlockComponent;
}
