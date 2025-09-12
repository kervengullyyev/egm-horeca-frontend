"use client";

import { useState, useCallback } from "react";
import { Product, ProductVariant } from "@/lib/api";
import ProductVariants from "@/components/ProductVariants";
import ProductActions from "@/components/ProductActions";
import ProductContact from "@/components/ProductContact";
import T from "@/components/T";

interface ProductDetailsClientProps {
  product: Product;
  variants: ProductVariant[];
  productName: string;
  productDescription?: string;
}

export default function ProductDetailsClient({
  product,
  variants,
  productName,
  productDescription
}: ProductDetailsClientProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [currentPrice, setCurrentPrice] = useState(product.price || 0);

  const handlePriceChange = useCallback((newPrice: number) => {
    setCurrentPrice(newPrice);
  }, []);

  const handleVariantsChange = useCallback((newVariants: Record<string, ProductVariant>) => {
    setSelectedVariants(newVariants);
  }, []);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{productName}</h1>
      
      {/* Price - Server rendered */}
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{currentPrice.toFixed(2)} RON</span>
          {product.sale_price && product.sale_price > 0 && (
            <span className="ml-2 text-lg text-gray-500 line-through">{(product.sale_price || 0).toFixed(2)} RON</span>
          )}
        </div>
      </div>

      {/* Description - Server rendered */}
      {productDescription && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            <T k="description" />
          </h3>
          <p className="text-foreground/70 leading-relaxed">{productDescription}</p>
        </div>
      )}

      {/* Variants - Client component */}
      {product.has_variants && variants.length > 0 && (
        <div className="mt-6">
          <ProductVariants
            product={product}
            variants={variants}
            onPriceChange={handlePriceChange}
            onVariantsChange={handleVariantsChange}
          />
        </div>
      )}

      {/* Add to cart and favorite - Client components */}
      <div className="mt-8 space-y-3">
        <ProductActions
          product={product}
          currentPrice={currentPrice}
          selectedVariants={selectedVariants}
          selectedSize={null}
        />
      </div>

      {/* For more details - Client component */}
      <ProductContact productName={productName} productSlug={product.slug} />
    </div>
  );
}
