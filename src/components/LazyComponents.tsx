import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Category } from '@/lib/api';

// Lazy load heavy components
export const LazyProductImageGallery = dynamic(
  () => import('@/components/ProductImageGalleryMinimal'),
  {
    loading: () => (
      <div className="aspect-square bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading gallery...</div>
      </div>
    ),
    ssr: false
  }
);

export const LazyCategoryMenuClient = dynamic(
  () => import('@/components/CategoryMenuClient'),
  {
    loading: () => (
      <div className="h-12 bg-gray-200 animate-pulse rounded" />
    ),
    ssr: false
  }
);

export const LazyOptimizedSearch = dynamic(
  () => import('@/components/OptimizedSearch'),
  {
    loading: () => (
      <div className="w-full max-w-4xl mx-auto">
        <div className="h-12 bg-gray-200 animate-pulse rounded-lg mb-6" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
);

// Wrapper components with Suspense
export const SuspenseProductImageGallery = ({ images, productName }: { images: string[]; productName: string }) => (
  <Suspense fallback={
    <div className="aspect-square bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading gallery...</div>
    </div>
  }>
    <LazyProductImageGallery images={images} productName={productName} />
  </Suspense>
);

export const SuspenseCategoryMenuClient = ({ categories }: { categories: Category[] }) => (
  <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse rounded" />}>
    <LazyCategoryMenuClient categories={categories} />
  </Suspense>
);

export const SuspenseOptimizedSearch = (props: Record<string, unknown>) => (
  <Suspense fallback={
    <div className="w-full max-w-4xl mx-auto">
      <div className="h-12 bg-gray-200 animate-pulse rounded-lg mb-6" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  }>
    <LazyOptimizedSearch {...props} />
  </Suspense>
);
