/**
 * syncBlockTypes — Called once at server startup via instrumentation.ts
 *
 * 1. Registers all block TYPE manifests (update_or_create → idempotent)
 * 2. Syncs default block CONFIG instances (get_or_create → preserves admin changes)
 *
 * Both endpoints are restricted to localhost on the API side (no token needed).
 * Errors are caught and logged without crashing the server.
 */

import type { BlockManifest } from "@/src/components/blocks/BlockRegistry";
import type { DefaultBlockConfig } from "@/src/blocks/defaults";

interface SyncOptions {
  apiBaseUrl: string;
  manifests: BlockManifest[];
  defaults: DefaultBlockConfig[];
}

async function postToApi(url: string, data: unknown): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "(no body)");
    throw new Error(`POST ${url} → HTTP ${response.status}: ${text}`);
  }
}

export async function syncBlockTypes(options: SyncOptions): Promise<void> {
  const { apiBaseUrl, manifests, defaults } = options;
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;

  // --- Step 1: Register block types (manifests) ---
  const registerUrl = `${base}api/layout/block-types/register/`;
  try {
    await postToApi(registerUrl, manifests);
    console.log(`[BlockSync] ✅ Registered ${manifests.length} block type(s).`);
  } catch (err) {
    console.warn(`[BlockSync] ⚠️  Failed to register block types: ${err}`);
  }

  // --- Step 2: Sync default block configs ---
  const syncDefaultsUrl = `${base}api/layout/blocks/sync-defaults/`;
  try {
    await postToApi(syncDefaultsUrl, defaults);
    console.log(`[BlockSync] ✅ Synced ${defaults.length} default block config(s).`);
  } catch (err) {
    console.warn(`[BlockSync] ⚠️  Failed to sync default blocks: ${err}`);
  }
}
