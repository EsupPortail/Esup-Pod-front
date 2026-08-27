/**
 * Next.js Instrumentation Hook
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * `register()` is called ONCE when the Next.js server starts (both dev and prod).
 * We use it to sync block type manifests and default block configs with the Django API.
 *
 * This runs server-side only — no browser security concerns.
 * The API endpoints are restricted to localhost, so no authentication token is needed.
 */

export async function register() {
  // Only run in the Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const apiBaseUrl =
    process.env.BACK_URL ?? // server-side internal URL (e.g., http://api:8000)
    process.env.NEXT_PUBLIC_BACK_URL ?? // fallback to public URL
    "http://localhost:8000";

  try {
    // Dynamic imports to avoid bundling issues (these are server-only modules)
    const { allManifests } = await import(
      "@/src/components/blocks/BlockRegistry"
    );
    const { defaultBlocks } = await import("@/src/blocks/defaults");
    const { syncBlockTypes } = await import("@/src/utils/syncBlockTypes");

    await syncBlockTypes({
      apiBaseUrl,
      manifests: allManifests,
      defaults: defaultBlocks,
    });
  } catch (err) {
    // Never crash the server if sync fails
    console.warn("[BlockSync] ⚠️  Startup sync error (non-fatal):", err);
  }
}
