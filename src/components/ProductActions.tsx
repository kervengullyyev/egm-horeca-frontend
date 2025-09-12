"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toggleFavorite } from "@/lib/favorites";
import { Product, ProductVariant } from "@/lib/api";
import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ProductActionsProps {
  product: Product;
  currentPrice: number;
  selectedVariants: Record<string, ProductVariant>;
  selectedSize: string | null;
}

export default function ProductActions({ 
  product, 
  currentPrice, 
  selectedVariants, 
  selectedSize 
}: ProductActionsProps) {
  const { t } = useTranslation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [favorites, setFavorites] = useState<Set<string> | null>(null);

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

  // Helper function to check if current product is in favorites
  const isCurrentProductFavorited = () => {
    return favorites?.has(product.slug) ?? false;
  };

  const handleToggleFavorite = (productSlug: string, productData: { id: string; name: string; price: number; image?: string }) => {
    toggleFavorite(productData);
    
    setFavorites(prev => {
      if (!prev) return new Set([productSlug]);
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

  const onAddToCart = () => {
    try {
      addToCart({ 
        id: product.id.toString(),
        slug: product.slug, 
        name: product.name_en, 
        price: currentPrice, 
        qty: 1, 
        size: selectedSize ?? null, 
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        variants: Object.keys(selectedVariants).length > 0 ? 
          Object.entries(selectedVariants).reduce((acc, [key, variant]) => {
            acc[key] = {
              name_en: key,
              value_en: variant.value_en,
              price: variant.price || 0
            };
            return acc;
          }, {} as Record<string, { name_en: string; value_en: string; price: number }>) 
          : undefined
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
      
      // Show success toast
      toast.success(`${t('addedToCart')}: ${product.name_en}`, {
        description: `${currentPrice} RON`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding item to cart. Please try again.');
    }
  };

  const onToggleFavorite = () => {
    const productData = {
      id: product.slug,
      name: product.name_en,
      price: product.price || 0,
      image: product.images && product.images.length > 0 ? product.images[0] : undefined
    };
    handleToggleFavorite(product.slug, productData);
  };

  return (
    <div className="mt-8 space-y-3">
      <button
        onClick={onAddToCart}
        className="w-full px-6 py-3 rounded-full font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {addedToCart ? t('addedToCart') : t('addToCart')}
      </button>

      <button
        onClick={onToggleFavorite}
        className={`w-full px-6 py-3 rounded-full border border-gray-300 bg-white text-black font-medium transition-colors hover:bg-gray-50 ${
          isCurrentProductFavorited()
            ? 'border-red-200 bg-red-50 text-red-600' 
            : ''
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{t('addToFavorites')}</span>
          <Heart className={`h-5 w-5 ${isCurrentProductFavorited() ? 'fill-current' : ''}`} />
        </div>
      </button>
    </div>
  );
}
