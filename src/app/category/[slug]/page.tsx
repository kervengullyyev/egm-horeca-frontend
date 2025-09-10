import { notFound } from "next/navigation";
import CategoryPageClient from "@/components/CategoryPageClient";
import { getCachedCategoryBySlug, getCachedProducts } from "@/lib/server-api";

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
			<CategoryPageClient 
				category={category} 
				products={products} 
				title={title} 
			/>
		);
	} catch (error) {
		console.error("Error fetching category data:", error);
		notFound();
	}
}


