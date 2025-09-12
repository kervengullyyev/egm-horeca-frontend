"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductImageGalleryMinimalProps {
  images: string[];
  productName: string;
}

export default function ProductImageGalleryMinimal({ images, productName }: ProductImageGalleryMinimalProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const hasImages = images.length > 0;

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

  return (
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
                    alt={`${productName} ${idx + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
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
              alt={productName}
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
                        alt={`${productName} ${idx + 1}`}
                        width={600}
                        height={750}
                        className="aspect-[4/5] w-full object-cover"
                      />
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
                alt={productName}
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
                    alt={`${productName} ${idx + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
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
  );
}
