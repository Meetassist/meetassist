import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://meetassist.cc", lastModified: new Date() },
    { url: "https://meetassist.cc/login", lastModified: new Date() },
  ];
}
