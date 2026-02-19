import type { Payload } from "payload";
import type { Category } from "../../payload-types";

const categoriesData = [
  {
    name: "Politics",
    slug: "politics",
    description:
      "Coverage of local and national political news, elections, and government policies.",
    color: "#ef4444",
    icon: "landmark",
    order: 1,
  },
  {
    name: "Business",
    slug: "business",
    description: "Business news, market updates, and economic analysis.",
    color: "#22c55e",
    icon: "briefcase",
    order: 2,
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Latest tech news, gadget reviews, and innovation stories.",
    color: "#3b82f6",
    icon: "cpu",
    order: 3,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports news, match results, and athlete profiles.",
    color: "#f97316",
    icon: "trophy",
    order: 4,
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Movies, music, celebrity news, and pop culture.",
    color: "#a855f7",
    icon: "film",
    order: 5,
  },
  {
    name: "Health",
    slug: "health",
    description: "Health news, wellness tips, and medical breakthroughs.",
    color: "#14b8a6",
    icon: "heart-pulse",
    order: 6,
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific discoveries, research news, and space exploration.",
    color: "#6366f1",
    icon: "flask-conical",
    order: 7,
  },
  {
    name: "World",
    slug: "world",
    description: "International news and global events coverage.",
    color: "#0ea5e9",
    icon: "globe",
    order: 8,
  },
  {
    name: "Opinion",
    slug: "opinion",
    description: "Editorials, columns, and reader perspectives.",
    color: "#eab308",
    icon: "message-square",
    order: 9,
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Travel, food, fashion, and everyday living stories.",
    color: "#ec4899",
    icon: "sparkles",
    order: 10,
  },
];

export async function seedCategories(payload: Payload): Promise<Category[]> {
  const createdCategories: Category[] = [];

  for (const categoryData of categoriesData) {
    const category = await payload.create({
      collection: "categories",
      data: categoryData,
    });
    createdCategories.push(category);
  }

  return createdCategories;
}
