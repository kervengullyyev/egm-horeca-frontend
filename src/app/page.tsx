"use client";

import { useState, useEffect } from "react";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import PromoBanner from "@/components/PromoBanner";
import CollectionShowcase from "@/components/CollectionShowcase";
import ConversationSection from "@/components/ConversationSection";
import { api, Product } from "@/lib/api";
import { toggleFavorite } from "@/lib/favorites";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
	const [featured, setFeatured] = useState<Product[]>([]);
	const [top, setTop] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const { currentLanguage } = useLanguage();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Fetch featured products (first 8 products)
				const featuredData = await api.getProducts({ limit: 8, active_only: true });
				setFeatured(featuredData);
				
				// Fetch top products (next 6 products)
				const topData = await api.getProducts({ limit: 6, skip: 8, active_only: true });
				setTop(topData);
			} catch (error) {
				console.error("Error fetching products:", error);
				// Fallback to empty arrays if API fails
				setFeatured([]);
				setTop([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Initialize favorites from localStorage
	useEffect(() => {
		const savedFavorites = localStorage.getItem('favorites');
		if (savedFavorites) {
			try {
				const favoritesData = JSON.parse(savedFavorites);
				setFavorites(new Set(favoritesData.map((item: { id: string }) => item.id)));
			} catch (error) {
				console.error('Error parsing favorites:', error);
			}
		}
	}, []);

	const handleToggleFavorite = (productSlug: string, productData: { id: string; name: string; price: number; image?: string }) => {
		toggleFavorite(productData);
		
		// Update local state immediately
		setFavorites(prev => {
			const newFavorites = new Set(prev);
			if (newFavorites.has(productSlug)) {
				newFavorites.delete(productSlug);
			} else {
				newFavorites.add(productSlug);
			}
			return newFavorites;
		});
		
		// Force re-render of all ProductCards
		setTimeout(() => {
			window.dispatchEvent(new Event('favoritesUpdated'));
		}, 100);
	};

	if (loading) {
		return (
			<main className="min-h-screen font-sans">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
							<p className="text-gray-600">Loading products...</p>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen font-sans">
			<div className="mx-auto max-w-7xl px-4 py-6">
				<HeroBanner />

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
								onToggleFavorite={() => handleToggleFavorite(p.slug, {
									id: p.slug,
									name: p.name_en,
									price: p.price,
									image: p.images && p.images.length > 0 ? p.images[0] : undefined
								})}
								isFavorited={favorites.has(p.slug)}
							/>
						))}
					</div>
				</section>

				{/* Category showcase between Featured and Top */}
				<CategoryShowcase />

				<section className="mt-12">
					<h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Top Products</h2>
					<div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
						{top.map((p) => (
							<ProductCard
								key={p.id}
								title={p.name_en}
								shortDescription={p.short_description_en || "Top-rated professional product"}
								price={p.price}
								images={p.images}
								href={`/product/${p.slug}`}
								productId={p.id}
								onToggleFavorite={() => handleToggleFavorite(p.slug, {
									id: p.slug,
									name: p.name_en,
									price: p.price,
									image: p.images && p.images.length > 0 ? p.images[0] : undefined
								})}
								isFavorited={favorites.has(p.slug)}
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
