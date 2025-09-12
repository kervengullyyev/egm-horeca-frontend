import { notFound } from "next/navigation";
import { getCachedProductBySlug, getCachedProductVariants, getCachedProducts } from "@/lib/server-api";
import { ProductVariant, Product } from "@/lib/api";
import ProductImageGalleryMinimal from "@/components/ProductImageGalleryMinimal";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import RelatedProducts from "@/components/RelatedProducts";

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

		// Use product images or fallback to placeholder
		const images = product.images && product.images.length > 0 ? product.images : [];
		const productName = product.name_en;
		const productDescription = product.description_en;

		return (
			<main className="min-h-screen font-sans">
				<div className="mx-auto max-w-7xl px-4 py-8">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						{/* Left: Gallery */}
						<ProductImageGalleryMinimal images={images} productName={productName} />

						{/* Right: Details - Client Component */}
						<ProductDetailsClient
							product={product}
							variants={variants}
							productName={productName}
							productDescription={productDescription}
						/>
					</div>

					{/* Related Products - Client component */}
					<RelatedProducts products={relatedProducts} />
				</div>
			</main>
		);
	} catch (error) {
		console.error("Error fetching product:", error);
		notFound();
	}
}


