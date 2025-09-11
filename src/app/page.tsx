"use client";

import { useState, useEffect } from "react";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import CategoryShowcase from "@/components/CategoryShowcase";
import PromoBanner from "@/components/PromoBanner";
import CollectionShowcase from "@/components/CollectionShowcase";
import ConversationSection from "@/components/ConversationSection";
import ServicesSection from "@/components/ServicesSection";
import { toggleFavorite } from "@/lib/favorites";
import { Product } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
	const [featured, setFeatured] = useState<Product[]>([]);
	const [top, setTop] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
				if (!API_BASE_URL) {
					throw new Error('NEXT_PUBLIC_API_URL environment variable must be set');
				}

				const [featuredResponse, topResponse] = await Promise.all([
					fetch(`${API_BASE_URL}/products?limit=8&active_only=true&is_featured=true`, { cache: 'force-cache' }),
					fetch(`${API_BASE_URL}/products?limit=6&active_only=true&is_top_product=true`, { cache: 'force-cache' })
				]);

				if (!featuredResponse.ok || !topResponse.ok) {
					throw new Error('Failed to fetch products');
				}

				const [featuredData, topData] = await Promise.all([
					featuredResponse.json(),
					topResponse.json()
				]);

				setFeatured(featuredData);
				setTop(topData);
			} catch (error) {
				console.error('Error fetching home page data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Helper function to handle favorite toggle
	const handleToggleFavorite = (product: Product) => {
		const productData = {
			id: product.slug,
			name: product.name_en,
			price: product.price,
			image: product.images?.[0]
		};
		toggleFavorite(productData);
	};

	if (loading) {
		return (
			<main className="min-h-screen font-sans">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<HeroBanner />

					{/* Services Section */}
					<ServicesSection />

					{/* Featured Products Skeleton */}
					<section className="mt-10">
						<Skeleton className="h-8 w-48 mb-5" />
						<div className="mt-5 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
							{Array.from({ length: 8 }).map((_, index) => (
								<ProductCardSkeleton key={index} />
							))}
						</div>
					</section>

					{/* Category showcase */}
					<CategoryShowcase />

					{/* Top Products Skeleton */}
					<section className="mt-12">
						<Skeleton className="h-8 w-40 mb-5" />
						<div className="mt-5 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
							{Array.from({ length: 6 }).map((_, index) => (
								<ProductCardSkeleton key={index} />
							))}
						</div>
					</section>

					{/* Promo Banner */}
					<PromoBanner />

					{/* Collection Showcase */}
					<CollectionShowcase />

					{/* Conversation Section */}
					<ConversationSection />
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen font-sans">
			<div className="mx-auto max-w-7xl px-4 py-6">
				<HeroBanner />

				{/* Services Section */}
				<ServicesSection />

				<section className="mt-10">
					<h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Featured Products</h2>
					<div className="mt-5 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
						{featured.map((p) => (
							<ProductCard
								key={p.id}
								title={p.name_en}
								shortDescription={p.short_description_en || "Professional quality product"}
								price={p.price}
								images={p.images}
								href={`/product/${p.slug}`}
								productId={p.id}
								onToggleFavorite={() => handleToggleFavorite(p)}
							/>
						))}
					</div>
				</section>

				{/* Category showcase between Featured and Top */}
				<CategoryShowcase />

				<section className="mt-12">
					<h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Top Products</h2>
					<div className="mt-5 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
						{top.map((p) => (
							<ProductCard
								key={p.id}
								title={p.name_en}
								shortDescription={p.short_description_en || "Top-rated professional product"}
								price={p.price}
								images={p.images}
								href={`/product/${p.slug}`}
								productId={p.id}
								onToggleFavorite={() => handleToggleFavorite(p)}
							/>
						))}
					</div>
				</section>

				{/* Promo after Top Products */}
				<PromoBanner />

				{/* Collection section after promo */}
				<CollectionShowcase />

				{/* Conversation section before footer */}
				<ConversationSection />
			</div>
		</main>
	);
}
