export const APP_NAME = "The Daily Chronicle";
export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const ITEMS_PER_PAGE = 12;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_EXCERPT_LENGTH = 300;

export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  AUTHOR: "author",
  CONTRIBUTOR: "contributor",
} as const;

export const COMMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  SPAM: "spam",
} as const;

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  politics: "#3b82f6",
  business: "#10b981",
  technology: "#8b5cf6",
  sports: "#f59e0b",
  entertainment: "#ec4899",
  science: "#06b6d4",
  health: "#22c55e",
  world: "#6366f1",
};
