import { notFound } from "next/navigation";
import { getCachedCategoryBySlug, getCachedProducts } from "@/lib/server-api";
import CategoryProductList from "@/components/CategoryProductList";

function toTitleCase(slug: string): string {
	return slug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const title = toTitleCase(slug);
	
	try {
		// Fetch category data at build time
		const category = await getCachedCategoryBySlug(slug);
		
		// Fetch products for this category
		const products = await getCachedProducts({ 
			category_id: category.id,
			limit: 50,
			active_only: true 
		});
		
		return (
			<main className="min-h-screen font-sans">
				<div className="mx-auto max-w-7xl px-4 py-6">
					{/* Banner */}
					<section className="relative overflow-hidden rounded-[24px]">
						<div className="aspect-[16/5] w-full bg-[url('/window.svg')] bg-cover bg-center opacity-20" />
						<div className="absolute inset-0 bg-black/40" />
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
							<h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
								{category?.name_en || title}
							</h1>
							{category?.description_en && (
								<p className="text-lg text-gray-200 mt-2 max-w-2xl">
									{category.description_en}
								</p>
							)}
						</div>
					</section>

					{/* Product list */}
					<CategoryProductList products={products} currentLanguage="en" />
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error fetching category data:", error);
		notFound();
	}
}


