"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useSearch } from "@/lib/swr-api";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { toggleFavorite } from "@/lib/favorites";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OptimizedSearchProps {
  initialQuery?: string;
  onClose?: () => void;
}

const OptimizedSearch = memo(function OptimizedSearch({ 
  initialQuery = "", 
  onClose 
}: OptimizedSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    price_sort: "none" as "none" | "asc" | "desc"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Use the optimized search hook
  const { products, error, isLoading, isSearching } = useSearch(query, 300);

  // Apply filters to products
  const filteredProducts = useCallback(() => {
    if (!products) return [];
    
    let filtered = [...products];

    // Apply price filters
    if (filters.min_price) {
      const minPrice = parseFloat(filters.min_price);
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (filters.max_price) {
      const maxPrice = parseFloat(filters.max_price);
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Apply sorting
    if (filters.price_sort === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.price_sort === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, filters]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  }, [query, router, onClose]);

  const handleToggleFavorite = useCallback((productData: { id: string; name: string; price: number; image?: string }) => {
    toggleFavorite(productData);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      min_price: "",
      max_price: "",
      price_sort: "none"
    });
  }, []);

  const sortedProducts = filteredProducts();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Filter Button */}
        <div className="mt-3 flex justify-between items-center">
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Products</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Price (RON)</label>
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Price (RON)</label>
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort by Price</label>
                  <select
                    value={filters.price_sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, price_sort: e.target.value as "none" | "asc" | "desc" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="none">No sorting</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)} size="sm">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {query && (
            <div className="text-sm text-gray-600">
              {isSearching ? "Searching..." : `${sortedProducts.length} results`}
            </div>
          )}
        </div>
      </form>

      {/* Search Results */}
      {query && (
        <div className="space-y-4">
          {isLoading || isSearching ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading search results. Please try again.</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name_en}
                  shortDescription={product.short_description_en}
                  price={product.price}
                  images={product.images}
                  href={`/product/${product.slug}`}
                  productId={product.id}
                  onToggleFavorite={() => handleToggleFavorite({
                    id: product.slug,
                    name: product.name_en,
                    price: product.price,
                    image: product.images?.[0]
                  })}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default OptimizedSearch;
