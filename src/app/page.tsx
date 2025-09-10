import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import PromoBanner from "@/components/PromoBanner";
import CollectionShowcase from "@/components/CollectionShowcase";
import ConversationSection from "@/components/ConversationSection";
import ServicesSection from "@/components/ServicesSection";
import { getCachedFeaturedProducts, getCachedTopProducts } from "@/lib/server-api";

export default async function HomePage() {
	// Fetch data at build time
	const [featured, top] = await Promise.all([
		getCachedFeaturedProducts(),
		getCachedTopProducts()
	]);

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
