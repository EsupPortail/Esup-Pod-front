import LiveBlockComponent from "../WebTV/LiveBlockComponent";
import CollectionBlockComponent from "../WebTV/CollectionBlockComponent";
import VideoGridBlockComponent from "../WebTV/VideoGridBlockComponent";
import PresentationVideoBlockComponent from "../WebTV/PresentationVideoBlockComponent";
import CustomTextBlock from "./CustomTextBlock";
import WelcomeBannerBlockComponent from "./WelcomeBannerBlockComponent";
import ActionButtonsBlockComponent from "./ActionButtonsBlockComponent";

import { LiveBlockManifest } from "./manifests/LiveBlock.manifest";
import { CollectionBlockManifest } from "./manifests/CollectionBlock.manifest";
import { VideoGridBlockManifest } from "./manifests/VideoGridBlock.manifest";
import { CustomTextBlockManifest } from "./manifests/CustomTextBlock.manifest";
import { WelcomeBannerBlockManifest } from "./manifests/WelcomeBannerBlock.manifest";
import { ActionButtonsBlockManifest } from "./manifests/ActionButtonsBlock.manifest";
import { PresentationVideoBlockManifest } from "./manifests/PresentationVideoBlock.manifest";

export interface BlockManifest {
  frontend_id: string;
  name: string;
  description: string;
  version: string;
  fields_schema: Record<string, any>;
}

export interface BlockRegistration {
  component: React.ComponentType<any>;
  manifest: BlockManifest;
}

export const blockRegistry: Record<string, BlockRegistration> = {
  "webtv-hero-direct": { component: LiveBlockComponent, manifest: LiveBlockManifest },
  "live-block": { component: LiveBlockComponent, manifest: LiveBlockManifest },
  "collection-block": { component: CollectionBlockComponent, manifest: CollectionBlockManifest },
  "video-grid-block": { component: VideoGridBlockComponent, manifest: VideoGridBlockManifest },
  "presentation-video-block": { component: PresentationVideoBlockComponent, manifest: PresentationVideoBlockManifest },
  "custom-text-block": { component: CustomTextBlock, manifest: CustomTextBlockManifest },
  "welcome-banner-block": { component: WelcomeBannerBlockComponent, manifest: WelcomeBannerBlockManifest },
  "action-buttons-block": { component: ActionButtonsBlockComponent, manifest: ActionButtonsBlockManifest },
};

/**
 * All block manifests — exported for use in the sync mechanism (instrumentation.ts).
 * Add a new block here to have it automatically registered in the API on next startup.
 */
export const allManifests: BlockManifest[] = Object.values(blockRegistry).map(
  (reg) => reg.manifest
);

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
  if (
    lowerId.includes("collection") ||
    lowerId.includes("channel") ||
    lowerId.includes("theme") ||
    lowerId.includes("playlist")
  ) {
    return CollectionBlockComponent;
  }
  if (lowerId.includes("text") || lowerId.includes("custom") || lowerId.includes("html")) {
    return CustomTextBlock;
  }
  if (lowerId.includes("presentation") || lowerId.includes("hero")) {
    return PresentationVideoBlockComponent;
  }
  if (lowerId.includes("welcome") || lowerId.includes("banner")) {
    return WelcomeBannerBlockComponent;
  }
  if (lowerId.includes("action") || lowerId.includes("buttons")) {
    return ActionButtonsBlockComponent;
  }

  return VideoGridBlockComponent;
}
