"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import VariantSelector from "@/components/VariantSelector";
import { addToCart } from "@/lib/cart";
import { toggleFavorite } from "@/lib/favorites";
import { Product, ProductVariant } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductPageClientProps {
  product: Product;
  variants: ProductVariant[];
  relatedProducts: Product[];
}

export default function ProductPageClient({ product, variants, relatedProducts }: ProductPageClientProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [favorites, setFavorites] = useState<Set<string> | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [currentPrice, setCurrentPrice] = useState(product.price || 0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [origin, setOrigin] = useState<string>('');

  // Initialize favorites from localStorage and origin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set origin for WhatsApp link
      setOrigin(window.location.origin);
      
      // Load favorites
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

  // Auto-select first available variant
  useEffect(() => {
    if (variants.length > 0) {
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
      setCurrentPrice(initialVariantPrice);
    }
  }, [variants, product.price, product.variant_type_en]);

  // Sync carousel with image index
  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on("select", () => {
      setImageIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Sync image index with carousel
  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.scrollTo(imageIndex);
  }, [carouselApi, imageIndex]);

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

  const handleVariantChange = (newSelectedVariants: Record<string, ProductVariant>) => {
    setSelectedVariants(newSelectedVariants);
    
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
    setCurrentPrice(newPrice);
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

  // Use product images or fallback to placeholder
  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasImages = images.length > 0;

  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Gallery */}
          <div className="space-y-4">
            {/* Desktop: Side-by-side layout */}
            <div className="hidden lg:grid grid-cols-[88px_1fr] items-start gap-4">
              {/* Thumbnail list - Desktop */}
              <ul className="flex max-h-[640px] flex-col gap-3 overflow-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {hasImages ? (
                  images.map((image, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setImageIndex(idx)}
                        onMouseEnter={() => setImageIndex(idx)}
                        className={`block h-16 w-16 overflow-hidden rounded-md border transition-all duration-200 relative ${
                          imageIndex === idx 
                            ? "border-gray-600 border-1" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image 
                          src={image} 
                          alt={`${product.name_en} ${idx + 1}`}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                        <div className="hidden h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </button>
                    </li>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => setImageIndex(idx)}
                        onMouseEnter={() => setImageIndex(idx)}
                        className={`block h-16 w-16 overflow-hidden rounded-md border transition-all duration-200 relative ${
                          imageIndex === idx 
                            ? "border-gray-600 border-2" 
                            : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {/* Main image - Desktop */}
              <div className="relative overflow-hidden rounded-xl border border-black/10">
                {hasImages ? (
                  <Image 
                    key={imageIndex}
                    src={images[imageIndex]} 
                    alt={product.name_en}
                    width={600}
                    height={750}
                    className="aspect-[4/5] w-full object-cover transition-opacity duration-300 ease-in-out"
                  />
                ) : null}
                <div className={`aspect-[4/5] w-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${hasImages ? 'hidden' : 'flex'}`}>
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
                
                {/* Navigation buttons */}
                {hasImages && images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      aria-label="Previous image"
                      onClick={() => setImageIndex((p) => (p - 1 + images.length) % images.length)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Next image"
                      onClick={() => setImageIndex((p) => (p + 1) % images.length)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Stacked layout */}
            <div className="lg:hidden space-y-4">
              {/* Main image carousel - Mobile */}
              {hasImages && images.length > 1 ? (
                <div className="relative">
                  <Carousel
                    setApi={setCarouselApi}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {images.map((image, idx) => (
                        <CarouselItem key={idx}>
                          <div className="relative overflow-hidden rounded-xl border border-black/10">
                            <Image 
                              src={image} 
                              alt={`${product.name_en} ${idx + 1}`}
                              width={600}
                              height={750}
                              className="aspect-[4/5] w-full object-cover"
                            />
                            <div className="hidden h-full w-full bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="h-16 w-16 text-gray-400" />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Fixed dots indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          if (carouselApi) {
                            carouselApi.scrollTo(dotIdx);
                          }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          imageIndex === dotIdx 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-black/10">
                  {hasImages ? (
                    <Image 
                      src={images[0]} 
                      alt={product.name_en}
                      width={600}
                      height={750}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  ) : null}
                  <div className={`aspect-[4/5] w-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${hasImages ? 'hidden' : 'flex'}`}>
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Thumbnail list - Mobile */}
              <ul className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {hasImages ? (
                  images.map((image, idx) => (
                    <li key={idx} className="flex-shrink-0">
                      <button
                        onClick={() => setImageIndex(idx)}
                        onMouseEnter={() => setImageIndex(idx)}
                        className={`block h-16 w-16 overflow-hidden rounded-md border transition-all duration-200 relative ${
                          imageIndex === idx 
                            ? "border-gray-600 border-1" 
                            : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <Image 
                          src={image} 
                          alt={`${product.name_en} ${idx + 1}`}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                        <div className="hidden h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </button>
                    </li>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <li key={idx} className="flex-shrink-0">
                      <button
                        onClick={() => setImageIndex(idx)}
                        onMouseEnter={() => setImageIndex(idx)}
                        className={`block h-16 w-16 overflow-hidden rounded-md border transition-all duration-200 relative ${
                          imageIndex === idx 
                            ? "border-gray-600 border-1" 
                            : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{currentLanguage === 'ro' ? (product.name_ro || product.name_en) : product.name_en}</h1>
            
            {/* Price */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{(currentPrice || 0).toFixed(2)} RON</span>
                {product.sale_price && product.sale_price > 0 && (
                  <span className="ml-2 text-lg text-gray-500 line-through">{(product.sale_price || 0).toFixed(2)} RON</span>
                )}
              </div>
            </div>

            {/* Description */}
            {(currentLanguage === 'ro' ? product.description_ro : product.description_en) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">{t('description')}</h3>
                <p className="text-foreground/70 leading-relaxed">{currentLanguage === 'ro' ? product.description_ro : product.description_en}</p>
              </div>
            )}

            {/* Variants */}
            {product.has_variants && variants.length > 0 && (
              <div className="mt-6">
                <VariantSelector
                  variants={variants}
                  variantType={product.variant_type_en || "Options"}
                  onVariantChange={handleVariantChange}
                  initialPrice={product.price || 0}
                />
              </div>
            )}

            {/* Add to cart and favorite */}
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

            {/* For more details */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">{t('forMoreDetails')}</p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/40741302753?text=Hello I am interested in ${product.name_en}. Product URL: ${origin}/product/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="tel:+40700000000"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  title={currentLanguage === 'ro' ? (relatedProduct.name_ro || relatedProduct.name_en) : relatedProduct.name_en}
                  shortDescription={currentLanguage === 'ro' ? (relatedProduct.short_description_ro || relatedProduct.short_description_en || "") : (relatedProduct.short_description_en || "")}
                  price={relatedProduct.price || 0}
                  images={relatedProduct.images}
                  href={`/product/${relatedProduct.slug}`}
                  onToggleFavorite={() => handleToggleFavorite(relatedProduct.slug, {
                    id: relatedProduct.slug,
                    name: currentLanguage === 'ro' ? (relatedProduct.name_ro || relatedProduct.name_en) : relatedProduct.name_en,
                    price: relatedProduct.price || 0,
                    image: relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : undefined
                  })}
                  isFavorited={favorites?.has(relatedProduct.slug) ?? false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
