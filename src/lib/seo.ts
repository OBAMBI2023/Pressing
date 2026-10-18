export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Laundry` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Laundry` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
