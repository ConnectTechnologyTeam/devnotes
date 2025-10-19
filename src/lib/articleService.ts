import { Article, Category, Tag, User } from "./mockData";

// API Configuration
// This can be easily changed to point to a real production API
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001/api"
  : import.meta.env.VITE_API_URL || "https://api.devnotes.com/api";

// Configuration object to make it easy to switch to real service
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  // This can be used to switch between mock and real services
  USE_MOCK_SERVICE: false, // Set to false for production
} as const;

/**
 * Production Deployment Notes:
 *
 * To switch to a real production API:
 * 1. Update BASE_URL to point to your production API endpoint
 * 2. Ensure your API implements the following endpoints:
 *    - GET /api/categories - Returns Category[]
 *    - GET /api/tags - Returns Tag[]
 *    - GET /api/posts - Returns PostResponse[]
 *    - POST /api/posts - Creates new post, returns PostResponse
 *    - PUT /api/posts/:id - Updates post, returns PostResponse
 *    - DELETE /api/posts/:id - Deletes post
 * 3. Ensure proper authentication headers are handled
 * 4. Test error handling and timeout scenarios
 */

// API Endpoints
const API_ENDPOINTS = {
  POSTS: "/posts",
  CATEGORIES: "/categories",
  TAGS: "/tags",
} as const;

// Error class for API errors
export class ApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Enhanced API request helper with configuration support
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Get auth token from sessionStorage
  const token = sessionStorage.getItem("auth_token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use default message
        if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (response.status === 403) {
          errorMessage =
            "Access denied. You don't have permission to perform this action.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle different types of errors for better UX
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.");
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.");
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

// Types for API requests and responses
export interface CreatePostRequest {
  title: string;
  summary: string;
  content: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  authorId: string;
  categoryId: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  summary?: string;
  content?: string;
  status?: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  categoryId?: string;
  tags?: string[];
}

export interface PostResponse {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  authorId: string;
  categoryId: string;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  rejectNote?: string;
}

// Article Service
export const articleService = {
  /**
   * Create a new article/post
   */
  createArticle: async (
    articleData: CreatePostRequest
  ): Promise<PostResponse> => {
    return apiRequest<PostResponse>(API_ENDPOINTS.POSTS, {
      method: "POST",
      body: JSON.stringify(articleData),
    });
  },

  /**
   * Update an existing article/post
   */
  updateArticle: async (
    id: string,
    updates: UpdatePostRequest
  ): Promise<PostResponse> => {
    return apiRequest<PostResponse>(`${API_ENDPOINTS.POSTS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete an article/post
   */
  deleteArticle: async (id: string): Promise<void> => {
    await apiRequest<void>(`${API_ENDPOINTS.POSTS}/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Get a single article/post by ID
   */
  getArticleById: async (id: string): Promise<PostResponse> => {
    return apiRequest<PostResponse>(`${API_ENDPOINTS.POSTS}/${id}`);
  },

  /**
   * Get all articles/posts with optional filters
   */
  getArticles: async (params?: {
    status?: string;
    authorId?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  }): Promise<PostResponse[]> => {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.set("status", params.status);
    if (params?.authorId) searchParams.set("authorId", params.authorId);
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
    if (params?.limit) searchParams.set("_limit", params.limit.toString());
    if (params?.offset) searchParams.set("_start", params.offset.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.POSTS}?${queryString}`
      : API_ENDPOINTS.POSTS;

    return apiRequest<PostResponse[]>(endpoint);
  },

  /**
   * Get articles by author
   */
  getArticlesByAuthor: async (authorId: string): Promise<PostResponse[]> => {
    return articleService.getArticles({ authorId });
  },

  /**
   * Get published articles
   */
  getPublishedArticles: async (): Promise<PostResponse[]> => {
    return articleService.getArticles({ status: "PUBLISHED" });
  },

  /**
   * Get pending articles (for admin review)
   */
  getPendingArticles: async (): Promise<PostResponse[]> => {
    return articleService.getArticles({ status: "PENDING" });
  },
};

// Category Service
export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    return apiRequest<Category[]>(API_ENDPOINTS.CATEGORIES);
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    return apiRequest<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};

// Tag Service
export const tagService = {
  /**
   * Get all tags
   */
  getTags: async (): Promise<Tag[]> => {
    return apiRequest<Tag[]>(API_ENDPOINTS.TAGS);
  },

  /**
   * Get a single tag by ID
   */
  getTagById: async (id: string): Promise<Tag> => {
    return apiRequest<Tag>(`${API_ENDPOINTS.TAGS}/${id}`);
  },
};
