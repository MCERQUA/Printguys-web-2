import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://printguys.ca";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/services/dtf`, lastModified: new Date() },
    { url: `${baseUrl}/services/screen-printing`, lastModified: new Date() },
    { url: `${baseUrl}/services/embroidery`, lastModified: new Date() },
    { url: `${baseUrl}/services/sublimation`, lastModified: new Date() },
    { url: `${baseUrl}/services/large-format`, lastModified: new Date() },
    { url: `${baseUrl}/services/uv-dtf-stickers`, lastModified: new Date() },
    { url: `${baseUrl}/services/safety-wear`, lastModified: new Date() },
    { url: `${baseUrl}/services/vinyl-banners`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/portfolio`, lastModified: new Date() },
    { url: `${baseUrl}/quote`, lastModified: new Date() },
  ];
}
