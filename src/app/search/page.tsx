"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SuspenseOptimizedSearch } from "@/components/LazyComponents";
import PerformanceMonitor from "@/components/PerformanceMonitor";

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <main className="min-h-screen font-sans">
      <PerformanceMonitor />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Products</h1>
          <p className="text-gray-600">Find the perfect products for your business</p>
        </div>
        
        <SuspenseOptimizedSearch initialQuery={query} />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <main className="min-h-screen font-sans">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-96" />
          </div>
          <div className="w-full max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 animate-pulse rounded-lg mb-6" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </main>
    }>
      <SearchPage />
    </Suspense>
  );
}