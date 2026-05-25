import { createStaticClient } from "@/lib/supabase/server";
import type { SiteConfig, SiteConfigKey } from "@/lib/types";

export async function getSiteConfig(keys: readonly SiteConfigKey[]) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("site_config")
    .select("*")
    .in("key", [...keys]);

  return (data ?? []).reduce<Partial<Record<SiteConfigKey, string>>>(
    (config, row: SiteConfig) => {
      if (keys.includes(row.key as SiteConfigKey)) {
        config[row.key as SiteConfigKey] = row.value;
      }

      return config;
    },
    {},
  );
}
