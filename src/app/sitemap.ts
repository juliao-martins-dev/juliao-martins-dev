import type { MetadataRoute } from "next";

import { SITE_URL } from "./robots";

/**
 * Replaces the hand-maintained public/sitemap.xml. One route today; adding a
 * page means adding an entry here rather than editing raw XML.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
