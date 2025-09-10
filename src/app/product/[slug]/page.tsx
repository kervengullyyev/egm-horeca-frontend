import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";
import { getCachedProductBySlug, getCachedProductVariants, getCachedProducts } from "@/lib/server-api";
import { ProductVariant, Product } from "@/lib/api";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	
	try {
		// Fetch product data at build time
		const product = await getCachedProductBySlug(slug);
		
		// Fetch variants if the product has them
		let variants: ProductVariant[] = [];
		if (product.has_variants) {
			try {
				variants = await getCachedProductVariants(product.id);
			} catch (error) {
				console.error("Error fetching variants:", error);
				variants = [];
			}
		}
		
		// Fetch related products from the same category
		let relatedProducts: Product[] = [];
		if (product.category_id) {
			try {
				const related = await getCachedProducts({ 
					category_id: product.category_id,
					limit: 4,
					active_only: true 
				});
				// Filter out the current product
				relatedProducts = related.filter(p => p.id !== product.id);
			} catch (error) {
				console.error("Error fetching related products:", error);
				relatedProducts = [];
			}
		}
		
		return (
			<ProductPageClient 
				product={product} 
				variants={variants} 
				relatedProducts={relatedProducts} 
			/>
		);
	} catch (error) {
		console.error("Error fetching product:", error);
		notFound();
	}
}


