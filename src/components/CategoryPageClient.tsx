"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product, Category } from "@/lib/api";
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

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
  title: string;
}

export default function CategoryPageClient({ category, products, title }: CategoryPageClientProps) {
  const { currentLanguage } = useLanguage();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    price_sort: "none" as "none" | "asc" | "desc"
  });

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

  const handleToggleFavorite = (productSlug: string, productData: { id: string; name: string; price: number; image?: string }) => {
    toggleFavorite(productData);
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productSlug)) {
        newFavorites.delete(productSlug);
      } else {
        newFavorites.add(productSlug);
      }
      return newFavorites;
    });
    
    setTimeout(() => {
      window.dispatchEvent(new Event('favoritesUpdated'));
    }, 100);
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

  const filteredProducts = products.filter(product => {
    if (filters.min_price && (product.price || 0) < parseFloat(filters.min_price)) return false;
    if (filters.max_price && (product.price || 0) > parseFloat(filters.max_price)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.price_sort === "asc") {
      return (a.price || 0) - (b.price || 0);
    } else if (filters.price_sort === "desc") {
      return (b.price || 0) - (a.price || 0);
    }
    return 0; // No sorting
  });

  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-[24px]">
          <div className="aspect-[16/5] w-full bg-[url('/window.svg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              {currentLanguage === 'ro' ? (category?.name_ro || category?.name_en || title) : (category?.name_en || title)}
            </h1>
            {(currentLanguage === 'ro' ? category?.description_ro : category?.description_en) && (
              <p className="text-lg text-gray-200 mt-2 max-w-2xl">
                {currentLanguage === 'ro' ? category?.description_ro : category?.description_en}
              </p>
            )}
          </div>
        </section>

        {/* Product list */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              {sortedProducts.length > 0 ? `${sortedProducts.length} Products` : 'No Products Found'}
            </h2>
            
            {/* Filter Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Category Filters</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Price Range */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.min_price}
                        onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.max_price}
                        onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Price Sorting */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Price Sorting</label>
                    <select
                      value={filters.price_sort}
                      onChange={(e) => setFilters({ ...filters, price_sort: e.target.value as "none" | "asc" | "desc" })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                    >
                      <option value="none">No sorting</option>
                      <option value="asc">Price: Low to High</option>
                      <option value="desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      Clear
                    </Button>
                    <Button onClick={applyFilters} className="flex-1">
                      Apply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={currentLanguage === 'ro' ? (product.name_ro || product.name_en) : product.name_en}
                  shortDescription={currentLanguage === 'ro' ? (product.short_description_ro || product.short_description_en || "") : (product.short_description_en || "")}
                  price={product.price}
                  images={product.images}
                  href={`/product/${product.slug}`}
                  onToggleFavorite={() => handleToggleFavorite(product.slug, {
                    id: product.slug,
                    name: currentLanguage === 'ro' ? (product.name_ro || product.name_en) : product.name_en,
                    price: product.price,
                    image: product.images && product.images.length > 0 ? product.images[0] : undefined
                  })}
                  isFavorited={favorites.has(product.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
              <p className="text-gray-400 mt-2">Check back later for new products!</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
