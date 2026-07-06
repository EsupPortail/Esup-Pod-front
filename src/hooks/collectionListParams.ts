import type { CollectionFiltersValue } from "@/src/components/collection/filters/CollectionFilters";

export type CollectionListParams = Partial<CollectionFiltersValue> & {
  page?: number;
};

export const applyCollectionSearchParams = (
  url: URL,
  params?: CollectionListParams,
) => {
  if (!params) return;

  if (params.search) {
    url.searchParams.set("search", params.search);
  }

  if (params.ordering) {
    url.searchParams.set("ordering", params.ordering);
  }

  if (params.page) {
    url.searchParams.set("page", String(params.page));
  }

  if (params.ownerUsernames?.length) {
    url.searchParams.set("owner__username", params.ownerUsernames.join(","));
  }

  if (params.createdAtGte) {
    url.searchParams.set(
      "created_at__gte",
      new Date(params.createdAtGte).toISOString(),
    );
  }

  if (params.createdAtLte) {
    url.searchParams.set(
      "created_at__lte",
      new Date(params.createdAtLte).toISOString(),
    );
  }

  if (params.channel != null) {
    url.searchParams.set("channel", String(params.channel));
  }
};
