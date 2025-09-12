"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/lib/cart";
import { useTranslation } from "react-i18next";

type AddToCartButtonProps = {
	productId?: string | number;
	slug?: string;
	name: string;
	price: number;
	image?: string | null;
};

export default function AddToCartButton({ productId, slug, name, price, image }: AddToCartButtonProps) {
	const { t } = useTranslation();

	return (
		<button 
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				const cartItem = {
					id: (productId?.toString() || slug || 'unknown') as string,
					slug,
					name,
					price,
					qty: 1,
					image: image || null,
					size: null,
					variants: undefined
				};
				try {
					addToCart(cartItem);
					toast.success(`${t('addedToCart')}: ${name}`, {
						description: `${price} RON`,
						duration: 3000,
					});
				} catch {
					toast.error('Error adding item to cart. Please try again.');
				}
			}}
			className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
		>
			{t('addToCart')}
			<ArrowRight className="h-4 w-4" />
		</button>
	);
}


