import { unstable_cache } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable must be set');
}

// Server-side API client with caching
class ServerApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Server API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
}

const serverApiClient = new ServerApiClient(API_BASE_URL);

// Import types from the main API file
import type { Category, Product, ProductVariant } from './api';

// Cached data fetching functions
export const getCachedCategories = unstable_cache(
  async () => {
    return serverApiClient.get<Category[]>('/categories');
  },
  ['categories'],
  {
    tags: ['categories'],
    revalidate: 3600, // 1 hour
  }
);

export const getCachedProducts = unstable_cache(
  async (params?: {
    skip?: number;
    limit?: number;
    active_only?: boolean;
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    brand?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return serverApiClient.get<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
  },
  ['products'],
  {
    tags: ['products'],
    revalidate: 1800, // 30 minutes
  }
);

export const getCachedFeaturedProducts = unstable_cache(
  async () => {
    return serverApiClient.get<Product[]>('/products?limit=8&active_only=true');
  },
  ['featured-products'],
  {
    tags: ['featured-products', 'products'],
    revalidate: 1800, // 30 minutes
  }
);

export const getCachedTopProducts = unstable_cache(
  async () => {
    return serverApiClient.get<Product[]>('/products?limit=6&skip=8&active_only=true');
  },
  ['top-products'],
  {
    tags: ['top-products', 'products'],
    revalidate: 1800, // 30 minutes
  }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return serverApiClient.get<Product>(`/products/slug/${slug}`);
  },
  ['product'],
  {
    tags: ['products'],
    revalidate: 1800, // 30 minutes
  }
);

export const getCachedCategoryBySlug = unstable_cache(
  async (slug: string) => {
    return serverApiClient.get<Category>(`/categories/slug/${slug}`);
  },
  ['category'],
  {
    tags: ['categories'],
    revalidate: 3600, // 1 hour
  }
);

export const getCachedProductsByCategory = unstable_cache(
  async (categoryId: number) => {
    return serverApiClient.get<Product[]>(`/products?category_id=${categoryId}&limit=50&active_only=true`);
  },
  ['products-by-category'],
  {
    tags: ['products'],
    revalidate: 1800, // 30 minutes
  }
);

export const getCachedProductVariants = unstable_cache(
  async (productId: number) => {
    return serverApiClient.get<ProductVariant[]>(`/products/${productId}/variants`);
  },
  ['product-variants'],
  {
    tags: ['products'],
    revalidate: 1800, // 30 minutes
  }
);
