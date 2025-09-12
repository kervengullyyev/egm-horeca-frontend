"use client";

import { useState, useEffect, useCallback } from "react";
import VariantSelector from "@/components/VariantSelector";
import { Product, ProductVariant } from "@/lib/api";

interface ProductVariantsProps {
  product: Product;
  variants: ProductVariant[];
  onPriceChange?: (price: number) => void;
  onVariantsChange?: (variants: Record<string, ProductVariant>) => void;
}

export default function ProductVariants({ 
  product, 
  variants, 
  onPriceChange = () => {}, 
  onVariantsChange = () => {} 
}: ProductVariantsProps) {
  const [, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-select first available variant only once
  useEffect(() => {
    if (!isInitialized && variants.length > 0) {
      const autoSelectedVariants: Record<string, ProductVariant> = {};
      let initialVariantPrice = product.price || 0;
      
      const firstAvailableVariant = variants.find(variant => 
        variant.is_active && variant.stock_quantity > 0
      );
      
      if (firstAvailableVariant) {
        const variantType = product.variant_type_en || "Options";
        autoSelectedVariants[variantType] = firstAvailableVariant;
        
        if ((firstAvailableVariant.price || 0) > initialVariantPrice) {
          initialVariantPrice = firstAvailableVariant.price || 0;
        }
      }
      
      setSelectedVariants(autoSelectedVariants);
      onVariantsChange(autoSelectedVariants);
      onPriceChange(initialVariantPrice);
      setIsInitialized(true);
    }
  }, [variants, product.price, product.variant_type_en, isInitialized, onPriceChange, onVariantsChange]);

  const handleVariantChange = useCallback((newSelectedVariants: Record<string, ProductVariant>) => {
    setSelectedVariants(newSelectedVariants);
    onVariantsChange(newSelectedVariants);
    
    let newPrice = product.price || 0;
    if (Object.keys(newSelectedVariants).length > 0) {
      const firstVariant = Object.values(newSelectedVariants)[0];
      newPrice = firstVariant.price || 0;
      
      Object.values(newSelectedVariants).forEach(variant => {
        if ((variant.price || 0) > newPrice) {
          newPrice = variant.price || 0;
        }
      });
    }
    onPriceChange(newPrice);
  }, [product.price, onVariantsChange, onPriceChange]);

  if (!product.has_variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <VariantSelector
        variants={variants}
        variantType={product.variant_type_en || "Options"}
        onVariantChange={handleVariantChange}
        initialPrice={product.price || 0}
      />
    </div>
  );
}
