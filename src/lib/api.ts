const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable must be set');
}

// Generic API client
class ApiClient {
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Types
export interface Category {
  id: number;
  name_en: string;
  name_ro: string;
  slug: string;
  description_en?: string;
  description_ro?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name_en: string;
  name_ro: string;
  slug: string;
  description_en?: string;
  description_ro?: string;
  short_description_en?: string;
  short_description_ro?: string;
  price: number;
  sale_price?: number;
  category_id: number;
  brand?: string;
  sku?: string;
  stock_quantity: number;
  is_active: boolean;
  images?: string[];
  has_variants: boolean;
  variant_type_en?: string;  // e.g., "Size", "Color", "Material"
  variant_type_ro?: string;  // Romanian variant type
  variants?: ProductVariant[];
  category?: Category;
  created_at: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  value_en: string;
  value_ro: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_address?: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  payment_status: string;
  payment_method?: string;
  notes?: string;
  user: User;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data?: Record<string, unknown>;
}

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: Product;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_products: number;
  total_orders: number;
  total_customers: number;
  pending_orders: number;
}

// API functions
export const api = {
  // Categories
  getCategories: () => apiClient.get<Category[]>('/categories'),
  getCategory: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  getCategoryBySlug: (slug: string) => apiClient.get<Category>(`/categories/slug/${slug}`),
  createCategory: (data: Partial<Category>) => apiClient.post<Category>('/categories', data),
  updateCategory: (id: number, data: Partial<Category>) => apiClient.put<Category>(`/categories/${id}`, data),
  deleteCategory: (id: number) => apiClient.delete(`/categories/${id}`),

  // Products
  getProducts: (params?: {
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
    return apiClient.get<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getProduct: (id: number) => apiClient.get<Product>(`/products/${id}`),
  getProductBySlug: (slug: string) => apiClient.get<Product>(`/products/slug/${slug}`),
  createProduct: (data: Partial<Product>) => apiClient.post<Product>('/products', data),
  updateProduct: (id: number, data: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, data),
  deleteProduct: (id: number) => apiClient.delete(`/products/${id}`),

  // Users
  getUsers: (params?: { skip?: number; limit?: number; active_only?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiClient.get<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
  },
  getUser: (id: number) => apiClient.get<User>(`/users/${id}`),
  createUser: (data: Partial<User> & { password: string }) => apiClient.post<User>('/users', data),
  updateUser: (id: number, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),
  deleteUser: (id: number) => apiClient.delete(`/users/${id}`),

  // Orders
  getOrders: (params?: { skip?: number; limit?: number; user_id?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiClient.get<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  getOrder: (id: number) => apiClient.get<Order>(`/orders/${id}`),
  createOrder: (data: Record<string, unknown>) => apiClient.post<Order>('/orders', data),
  updateOrder: (id: number, data: Partial<Order>) => apiClient.put<Order>(`/orders/${id}`, data),

  // Favorites
  getUserFavorites: (userId: number, params?: { skip?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiClient.get<Favorite[]>(`/users/${userId}/favorites${queryString ? `?${queryString}` : ''}`);
  },
  addFavorite: (data: { user_id: number; product_id: number }) => apiClient.post<Favorite>('/favorites', data),
  removeFavorite: (userId: number, productId: number) => apiClient.delete(`/users/${userId}/favorites/${productId}`),
  checkFavorite: (userId: number, productId: number) => apiClient.get<{ is_favorite: boolean }>(`/users/${userId}/favorites/${productId}/check`),

  // Messages
  getMessages: (params?: { skip?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return apiClient.get<Message[]>(`/messages${queryString ? `?${queryString}` : ''}`);
  },
  getMessage: (id: number) => apiClient.get<Message>(`/messages/${id}`),
  createMessage: (data: Partial<Message>) => apiClient.post<Message>('/messages', data),
  updateMessage: (id: number, data: Partial<Message>) => apiClient.put<Message>(`/messages/${id}`, data),

  // Dashboard
  getDashboardStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),

  // Product Variants
  getProductVariants: (productId: number) => apiClient.get<ProductVariant[]>(`/products/${productId}/variants`),
  createProductVariant: (productId: number, data: Partial<ProductVariant>) => apiClient.post<ProductVariant>(`/products/${productId}/variants`, data),
  updateProductVariant: (id: number, data: Partial<ProductVariant>) => apiClient.put<ProductVariant>(`/variants/${id}`, data),
  deleteProductVariant: (id: number) => apiClient.delete(`/variants/${id}`),

  // Health check
  healthCheck: () => apiClient.get<{ status: string; message: string }>('/health'),
};

export default api;
