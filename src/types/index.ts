// API Response Types
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

// Component Prop Types
export interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: MediaData | string;
  publishedDate: string;
  readTime?: number | null;
  views?: number | null;
  category?: CategoryData | string;
  author?: AuthorData | string;
  tags?: TagData[] | string[];
}

export interface MediaData {
  id: string;
  url?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null } | null;
    card?: { url?: string | null; width?: number | null } | null;
    tablet?: { url?: string | null; width?: number | null } | null;
    desktop?: { url?: string | null; width?: number | null } | null;
  } | null;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  order?: number | null;
}

export interface AuthorData {
  id: string;
  name: string;
  slug: string;
  email: string;
  bio?: string | null;
  role?: string | null;
  avatar?: MediaData | string;
  social?: {
    twitter?: string | null;
    linkedin?: string | null;
    facebook?: string | null;
    instagram?: string | null;
  } | null;
  featured?: boolean | null;
}

export interface TagData {
  id: string;
  name: string;
  slug: string;
}

// Search Types
export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: "article" | "category" | "author";
}

// Form Types
export interface NewsletterFormData {
  email: string;
}

export interface CommentFormData {
  article: string;
  author: string;
  email: string;
  content: string;
  parentComment?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
