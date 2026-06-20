export type Blog = {
  id: number;
  title: string;
  cover_image: string;
  excerpt: string;
  content: string;
  view_count: number;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogListResponse = {
  data: Blog[];
  pagination: Pagination;
};

export type BlogImage = {
  id: number;
  imageUrl: string;
  createdAt: string;
  blogId: number;
};

export type BlogDetail = Blog & {
  images: BlogImage[];
};
