import useSWR from 'swr';
import { api } from './api';
import { useState, useEffect } from 'react';

// Custom hooks for data fetching with caching
export const useProducts = (params?: {
  skip?: number;
  limit?: number;
  active_only?: boolean;
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  language?: string;
  is_featured?: boolean;
  is_top_product?: boolean;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['products', params],
    () => api.getProducts(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    products: data || [],
    error,
    isLoading,
    mutate,
  };
};

export const useProduct = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['product', id] : null,
    () => api.getProduct(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
    }
  );

  return {
    product: data,
    error,
    isLoading,
    mutate,
  };
};

export const useProductBySlug = (slug: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['product-slug', slug] : null,
    () => api.getProductBySlug(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
    }
  );

  return {
    product: data,
    error,
    isLoading,
    mutate,
  };
};

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    () => api.getCategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );

  return {
    categories: data || [],
    error,
    isLoading,
    mutate,
  };
};

export const useCategory = (id: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['category', id] : null,
    () => api.getCategory(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
    }
  );

  return {
    category: data,
    error,
    isLoading,
    mutate,
  };
};

export const useCategoryBySlug = (slug: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['category-slug', slug] : null,
    () => api.getCategoryBySlug(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
    }
  );

  return {
    category: data,
    error,
    isLoading,
    mutate,
  };
};

export const useProductVariants = (productId: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    productId ? ['product-variants', productId] : null,
    () => api.getProductVariants(productId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
    }
  );

  return {
    variants: data || [],
    error,
    isLoading,
    mutate,
  };
};

// Search hook with debouncing
export const useSearch = (query: string, debounceMs: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const { products, error, isLoading, mutate } = useProducts({
    search: debouncedQuery,
    active_only: true,
    limit: 20,
  });

  return {
    products,
    error,
    isLoading,
    mutate,
    isSearching: query !== debouncedQuery,
  };
};

// Featured products hook
export const useFeaturedProducts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'featured-products',
    () => api.getProducts({ limit: 8, active_only: true, is_featured: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );

  return {
    products: data || [],
    error,
    isLoading,
    mutate,
  };
};

// Top products hook
export const useTopProducts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'top-products',
    () => api.getProducts({ limit: 6, active_only: true, is_top_product: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
    }
  );

  return {
    products: data || [],
    error,
    isLoading,
    mutate,
  };
};

