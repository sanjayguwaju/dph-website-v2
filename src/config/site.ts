export const siteConfig = {
  name: "The Daily Chronicle",
  description: "Your trusted source for breaking news and in-depth reporting",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/assets/og-image.jpg",
  links: {
    twitter: "https://twitter.com/dailychronicle",
    facebook: "https://facebook.com/dailychronicle",
    instagram: "https://instagram.com/dailychronicle",
  },
  itemsPerPage: 12,
  featuredArticlesCount: 4,
  breakingNewsCount: 5,
  trendingArticlesCount: 5,
} as const;
