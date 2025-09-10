"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api, Product } from "@/lib/api";
import { toggleFavorite } from "@/lib/favorites";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    price_sort: "none" as "none" | "asc" | "desc"
  });
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // Initialize favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const favoritesData = JSON.parse(savedFavorites);
          setFavorites(new Set(favoritesData.map((item: { id: string }) => item.id)));
        } catch (error) {
          console.error('Error parsing favorites:', error);
        }
      }
    }
  }, []);

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchParams: Record<string, string | number | boolean> = {
        search: query,
        active_only: true,
        limit: 100,
        language: currentLanguage
      };

      // Add price filters
      if (filters.min_price) searchParams.min_price = parseFloat(filters.min_price);
      if (filters.max_price) searchParams.max_price = parseFloat(filters.max_price);

      const results = await api.getProducts(searchParams);
      setProducts(results);
    } catch (error) {
      console.error('Error performing search:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform search when query or filters change
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters, performSearch]);

  const handleToggleFavorite = (productData: { id: string; name: string; price: number; image?: string }) => {
    toggleFavorite(productData);
    // Update local state after toggling
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const favoritesData = JSON.parse(savedFavorites);
          setFavorites(new Set(favoritesData.map((item: { id: string }) => item.id)));
        } catch (error) {
          console.error('Error parsing favorites:', error);
        }
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      min_price: "",
      max_price: "",
      price_sort: "none"
    });
  };

  const applyFilters = () => {
    // Filters are automatically applied via useEffect
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (filters.price_sort === "asc") {
      return a.price - b.price;
    } else if (filters.price_sort === "desc") {
      return b.price - a.price;
    }
    return 0; // No sorting
  });

  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('searchResults')}
            </h1>
            
            {/* Filter Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t('filters')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('searchFilters')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Price Range */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t('priceRange')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={t('minPrice')}
                        value={filters.min_price}
                        onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                      />
                      <input
                        type="number"
                        placeholder={t('maxPrice')}
                        value={filters.max_price}
                        onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Price Sorting */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t('priceSorting')}</label>
                    <select
                      value={filters.price_sort}
                      onChange={(e) => setFilters({ ...filters, price_sort: e.target.value as "none" | "asc" | "desc" })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                    >
                      <option value="none">{t('noSorting')}</option>
                      <option value="asc">{t('priceLowToHigh')}</option>
                      <option value="desc">{t('priceHighToLow')}</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      {t('clear')}
                    </Button>
                    <Button onClick={applyFilters} className="flex-1">
                      {t('apply')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {query && (
            <p className="mt-2 text-gray-600">
              {t('showingResultsFor')} &quot;{query}&quot; • {sortedProducts.length} {t('productsFound')}
            </p>
          )}
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('searching')}</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProductsFound')}</h3>
            <p className="text-gray-600">
              {t('tryAdjustingSearch')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={currentLanguage === 'ro' ? (product.name_ro || product.name_en) : product.name_en}
                shortDescription={currentLanguage === 'ro' ? (product.short_description_ro || product.short_description_en || "") : (product.short_description_en || "")}
                price={product.price}
                images={product.images}
                href={`/product/${product.slug}`}
                productId={product.id}
                onToggleFavorite={() => handleToggleFavorite({
                  id: product.slug,
                  name: currentLanguage === 'ro' ? (product.name_ro || product.name_en) : product.name_en,
                  price: product.price,
                  image: product.images && product.images.length > 0 ? product.images[0] : undefined
                })}
                isFavorited={favorites.has(product.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-600">Loading…</div>}>
      <SearchPage />
    </Suspense>
  );
}
