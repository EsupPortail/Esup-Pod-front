import type { Channel, Theme } from "@/src/types";
import CollectionCard from "@/src/components/collection/CollectionCard";
import Grid from "@mui/material/Grid";

type CollectionsListProps = {
  channels?: Channel[];
  themes?: Theme[];
  channelSlug?: string;
  basePath?: string;
};

export default function CollectionsList({
  channels = [],
  themes = [],
  channelSlug,
  basePath,
}: CollectionsListProps) {
  const buildThemeHref = (theme: Theme) => {
    if (!channelSlug) return `/themes/${theme.slug}`;
    const suffix = basePath ? `${basePath}/${theme.slug}` : theme.slug;
    return `/channel/${channelSlug}/${suffix}`;
  };

  return (
    <div style={{ padding: "var(--c--globals--spacings--sm) 0" }}>
      <Grid container spacing={2}>
        {channels.map((channel) => (
          <Grid
            key={channel.slug}
            size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}
          >
            <CollectionCard type="channel" channel={channel} />
          </Grid>
        ))}

        {themes.map((theme) => (
          <Grid key={theme.id} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 2 }}>
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
