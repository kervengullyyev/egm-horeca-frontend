"use client";

import { useState } from "react";
import ProductCardServer from "@/components/ProductCardServer";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryFilters from "@/components/CategoryFilters";
import { Product } from "@/lib/api";

interface CategoryProductListProps {
  products: Product[];
  currentLanguage: "en" | "ro";
}

export default function CategoryProductList({ products, currentLanguage }: CategoryProductListProps) {
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    price_sort: "none" as "none" | "asc" | "desc",
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredProducts = products.filter((product) => {
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
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {sortedProducts.length > 0 ? `${sortedProducts.length} Products` : "No Products Found"}
        </h2>
        <CategoryFilters onFiltersChange={handleFiltersChange} />
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedProducts.map((product) => {
            const productName = currentLanguage === "ro" ? product.name_ro || product.name_en : product.name_en;
            const productDescription = currentLanguage === "ro" 
              ? product.short_description_ro || product.short_description_en || ""
              : product.short_description_en || "";

            return (
              <ProductCardServer
                key={product.id}
                title={productName}
                shortDescription={productDescription}
                price={product.price}
                images={product.images}
                href={`/product/${product.slug}`}
                productId={product.id}
                favoriteSlot={
                  <FavoriteButton
                    id={product.slug}
                    name={productName}
                    price={product.price}
                    image={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    ariaLabel="Add to favorites"
                  />
                }
                actionsSlot={
                  <AddToCartButton
                    productId={product.id}
                    slug={product.slug}
                    name={productName}
                    price={product.price}
                    image={product.images && product.images.length > 0 ? product.images[0] : null}
                  />
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
          <p className="text-gray-400 mt-2">Check back later for new products!</p>
        </div>
      )}
    </div>
  );
}
