"use client";

import { useState, useEffect } from "react";
import ProductCardServer from "@/components/ProductCardServer";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { currentLanguage } = useLanguage();
  const [, setFavorites] = useState<Set<string> | null>(null);

  // Initialize favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const favoritesData = JSON.parse(savedFavorites) as Array<{id: string}>;
          const favoritesSet = new Set(favoritesData.map(item => item.id));
          setFavorites(favoritesSet);
        } catch (error) {
          console.error('Error parsing favorites:', error);
        }
      }
    }
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Related Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((relatedProduct) => {
          const productName = currentLanguage === 'ro' ? (relatedProduct.name_ro || relatedProduct.name_en) : relatedProduct.name_en;
          const productDescription = currentLanguage === 'ro' ? (relatedProduct.short_description_ro || relatedProduct.short_description_en || "") : (relatedProduct.short_description_en || "");

          return (
            <ProductCardServer
              key={relatedProduct.id}
              title={productName}
              shortDescription={productDescription}
              price={relatedProduct.price || 0}
              images={relatedProduct.images}
              href={`/product/${relatedProduct.slug}`}
              productId={relatedProduct.id}
              favoriteSlot={
                <FavoriteButton
                  id={relatedProduct.slug}
                  name={productName}
                  price={relatedProduct.price || 0}
                  image={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : undefined}
                  ariaLabel="Add to favorites"
                />
              }
              actionsSlot={
                <AddToCartButton
                  productId={relatedProduct.id}
                  slug={relatedProduct.slug}
                  name={productName}
                  price={relatedProduct.price || 0}
                  image={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : null}
                />
              }
            />
          );
        })}
      </div>
    </section>
  );
}
