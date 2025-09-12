import HeroBanner from "@/components/HeroBanner";
import ProductCardServer from "@/components/ProductCardServer";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryShowcase from "@/components/CategoryShowcase";
import PromoBanner from "@/components/PromoBanner";
import CollectionShowcase from "@/components/CollectionShowcase";
import ConversationSection from "@/components/ConversationSection";
import ServicesSection from "@/components/ServicesSection";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { getCachedFeaturedProducts, getCachedTopProducts } from "@/lib/server-api";

export default async function HomePage() {
	// Use server-side caching for initial data
	const [featured, top] = await Promise.all([
		getCachedFeaturedProducts(),
		getCachedTopProducts()
	]);

	return (
		<main className="min-h-screen font-sans">
			<PerformanceMonitor />
			<div className="mx-auto max-w-7xl px-4 py-6">
				<HeroBanner />

				{/* Services Section */}
				<ServicesSection />

				<section className="mt-10">
					<h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Featured Products</h2>
					<div className="mt-5 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
						{featured.map((p) => (
							<ProductCardServer
								key={p.id}
								title={p.name_en}
								shortDescription={p.short_description_en || "Professional quality product"}
								price={p.price}
								images={p.images}
								href={`/product/${p.slug}`}
								productId={p.id}
								favoriteSlot={(
									<FavoriteButton id={p.slug} name={p.name_en} price={p.price} image={p.images?.[0]} ariaLabel="Add to favorites" />
								)}
								actionsSlot={(
									<AddToCartButton productId={p.id} slug={p.slug} name={p.name_en} price={p.price} image={p.images?.[0] || null} />
								)}
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
							<ProductCardServer
								key={p.id}
								title={p.name_en}
								shortDescription={p.short_description_en || "Top-rated professional product"}
								price={p.price}
								images={p.images}
								href={`/product/${p.slug}`}
								productId={p.id}
								favoriteSlot={(
									<FavoriteButton id={p.slug} name={p.name_en} price={p.price} image={p.images?.[0]} ariaLabel="Add to favorites" />
								)}
								actionsSlot={(
									<AddToCartButton productId={p.id} slug={p.slug} name={p.name_en} price={p.price} image={p.images?.[0] || null} />
								)}
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
