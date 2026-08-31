import type { Channel, Theme } from "@/src/types";
import CollectionCard from "@/src/components/collection/CollectionCard";
import Grid from "@mui/material/Grid";
import CollectionCardSkeleton from "./CollectionCardSkeleton";
import { useSidebar } from "@/src/context/SidebarProvider";

type CollectionsListProps = {
  channels?: Channel[];
  themes?: Theme[];
  channelSlug?: string;
  basePath?: string;
  loading?: boolean;
};

export default function CollectionsList({
  channels = [],
  themes = [],
  channelSlug,
  basePath,
  loading = false,
}: CollectionsListProps) {
  const buildThemeHref = (theme: Theme) => {
    if (!channelSlug) return `/themes/${theme.slug}`;
    const suffix = basePath ? `${basePath}/${theme.slug}` : theme.slug;
    return `/channel/${channelSlug}/${suffix}`;
  };

  const { sidebarFixed } = useSidebar();
  const xlSize = sidebarFixed ? 4 : 3;
  const lgSize = sidebarFixed ? 6 : 4;
  const mdSize = sidebarFixed ? 6 : 6;

  if (loading) {
    return (
      <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              key={`collection-skeleton-${index}`}
              size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
            >
              <CollectionCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
      <Grid container spacing={2}>
        {channels.map((channel) => (
          <Grid
            key={channel.slug}
            size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}
          >
            <CollectionCard type="channel" channel={channel} />
          </Grid>
        ))}

        {themes.map((theme) => (
          <Grid key={theme.id} size={{ xs: 12, sm: 12, md: mdSize, lg: lgSize, xl: xlSize }}>
            <CollectionCard
              type="theme"
              theme={theme}
              themeHref={buildThemeHref(theme)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
