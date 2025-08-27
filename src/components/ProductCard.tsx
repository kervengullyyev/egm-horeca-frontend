"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon, Heart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { useTranslation } from "react-i18next";

type ProductCardProps = {
	title: string;
	description?: string;
	shortDescription?: string;
	price: number;
	imageUrl?: string;
	images?: string[];
	href?: string;
	productId?: string | number;
	onToggleFavorite?: () => void;
	isFavorited?: boolean;
};

export default function ProductCard({
	title,
	description,
	shortDescription,
	price,
	imageUrl,
	images,
	href,
	productId,
	onToggleFavorite,
	isFavorited = false,
}: ProductCardProps) {
	const [isFavoritedState, setIsFavoritedState] = useState(false);
	const { t } = useTranslation();
	
	// Use images array if available, fallback to imageUrl, then to placeholder
	const displayImage = images && images.length > 0 ? images[0] : imageUrl;
	
	// Check if this product is in favorites and update state
	const updateFavoriteState = () => {
		if (!onToggleFavorite) return; // No favorite functionality
		
		// Extract product slug from href or use a fallback
		let productSlug = '';
		if (href) {
			// Extract slug from href like "/product/product-slug"
			const parts = href.split('/');
			productSlug = parts[parts.length - 1];
		}
		
		if (!productSlug) return;
		
		const savedFavorites = localStorage.getItem('favorites');
		if (savedFavorites) {
			try {
				const favoritesData = JSON.parse(savedFavorites) as Array<{id: string}>;
				const isFavorited = favoritesData.some(item => item.id === productSlug);
				console.log(`ProductCard ${productSlug}: isFavorited = ${isFavorited}`);
				setIsFavoritedState(isFavorited);
			} catch (error) {
				console.error('Error checking favorite status:', error);
			}
		} else {
			console.log(`ProductCard ${productSlug}: No favorites in localStorage`);
		}
	};
	
	// Initialize favorite state and listen for updates
	useEffect(() => {
		// Call updateFavoriteState immediately to set initial state
		updateFavoriteState();
		
		const handleFavoritesUpdate = () => {
			updateFavoriteState();
		};
		
		window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
		return () => {
			window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
		};
	}, [href]);

	// Also update state when href changes (different product)
	useEffect(() => {
		updateFavoriteState();
	}, [href]);


	
	return (
		<article className="rounded-2xl border border-black/10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
			<div className="relative m-2 overflow-hidden rounded-lg">
				{href ? (
					<Link href={href} className="block">
						{displayImage ? (
							<Image
								src={displayImage}
								alt={title}
								width={400}
								height={500}
								className="aspect-[4/5] w-full rounded-lg object-cover hover:opacity-90 transition-opacity cursor-pointer"
								onError={() => {
									// Fallback to placeholder if image fails to load
									const imgElement = document.querySelector(`[alt="${title}"]`) as HTMLElement;
									if (imgElement) imgElement.style.display = 'none';
									const placeholder = imgElement?.nextElementSibling as HTMLElement;
									if (placeholder) placeholder.style.display = 'flex';
								}}
							/>
						) : null}
						{/* Fallback placeholder */}
						<div 
							className={`aspect-[4/5] w-full rounded-md bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${displayImage ? 'hidden' : 'flex'}`}
						>
							<ImageIcon className="h-12 w-12 text-gray-400" />
						</div>
					</Link>
				) : (
					<>
						{displayImage ? (
							<Image
								src={displayImage}
								alt={title}
								width={400}
								height={500}
								className="aspect-[4/5] w-full rounded-lg object-cover"
								onError={() => {
									// Fallback to placeholder if image fails to load
									const imgElement = document.querySelector(`[alt="${title}"]`) as HTMLElement;
									if (imgElement) imgElement.style.display = 'none';
									const placeholder = imgElement?.nextElementSibling as HTMLElement;
									if (placeholder) placeholder.style.display = 'flex';
								}}
							/>
						) : null}
						{/* Fallback placeholder */}
						<div 
							className={`aspect-[4/5] w-full rounded-md bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${displayImage ? 'hidden' : 'flex'}`}
						>
							<ImageIcon className="h-12 w-12 text-gray-400" />
						</div>
					</>
				)}
				

									{onToggleFavorite && (
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								// Immediately update local state for instant feedback
								setIsFavoritedState(!isFavoritedState);
								// Then call the actual toggle function
								onToggleFavorite();
							}}
							className="absolute right-1 top-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow hover:bg-gray-50 transition-colors"
							aria-label={t('addToFavorites')}
						>
							<Heart className={`h-5 w-5 ${isFavoritedState ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
						</button>
					)}
				
				{/* Image indicators if multiple images */}
				{images && images.length > 1 && (
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
						{images.slice(0, 4).map((_, index) => (
							<span 
								key={index} 
								className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-white/80' : 'bg-white/40'}`} 
							/>
						))}
						{images.length > 4 && (
							<span className="h-1.5 w-1.5 rounded-full bg-white/60">+</span>
						)}
					</div>
				)}
			</div>

			<div className="px-3 pb-3 pt-1">
				{href ? (
					<Link href={href} className="text-lg font-semibold tracking-tight text-foreground hover:underline">
						{title}
					</Link>
				) : (
					<h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
				)}
				{shortDescription ? (
					<p className="mt-2 text-sm leading-6 text-foreground/70">{shortDescription}</p>
				) : null}

				{/* Price section */}
				<div className="mt-4">
					<div className="rounded-full bg-black/5 px-3 py-1.5 text-base font-semibold inline-block">{price} RON</div>
				</div>

				{/* Add to Cart button - moved down */}
				<div className="mt-3">
					<button 
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							
							// Debug logging
							console.log('Add to cart clicked for:', title);
							console.log('Product ID:', productId);
							console.log('Href:', href);
							
							// Create cart item using the existing cart system format
							const cartItem = {
								id: (productId?.toString() || (href ? href.split('/').pop() : 'unknown')) as string,
								slug: href ? href.split('/').pop() : undefined,
								name: title,
								price: price,
								qty: 1,
								image: displayImage || null,
								size: null,
								variants: undefined
							};
							
							console.log('Cart item to add:', cartItem);
							
							// Use the existing cart system
							try {
								addToCart(cartItem);
								console.log('Item added to cart successfully');
								
								// Show success message
								alert(`${t('addedToCart')}: ${title}`);
							} catch (error) {
								console.error('Error adding to cart:', error);
								alert('Error adding item to cart. Please try again.');
							}
						}}
						className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
					>
						{t('addToCart')}
						<ArrowRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</article>
	);
}


