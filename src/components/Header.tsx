"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X, Settings } from "lucide-react";
import { getCart } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";
import { useTranslation } from "react-i18next";
import { api, type Category } from "@/lib/api";
import Logo from "./Logo";

export default function Header() {
	const [query, setQuery] = useState("");
	const [cartCount, setCartCount] = useState(0);
	const [favoritesCount, setFavoritesCount] = useState(0);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const { t } = useTranslation();
	const router = useRouter();

	useEffect(() => {
		const updateCartCount = () => {
			const items = getCart();
			const total = items.reduce((sum, item) => sum + item.qty, 0);
			setCartCount(total);
		};

		const updateFavoritesCount = () => {
					// Try to get favorites from the library first, then fallback to localStorage
		try {
			const favorites = getFavorites();
			setFavoritesCount(favorites.length);
		} catch {
			// Fallback to reading directly from localStorage
			if (typeof window !== 'undefined') {
				const savedFavorites = localStorage.getItem('favorites');
				if (savedFavorites) {
					try {
						const favoritesData = JSON.parse(savedFavorites);
						setFavoritesCount(favoritesData.length);
					} catch (parseError) {
						console.error('Error parsing favorites from localStorage:', parseError);
						setFavoritesCount(0);
					}
				} else {
					setFavoritesCount(0);
				}
			} else {
				setFavoritesCount(0);
			}
		}
		};

		updateCartCount();
		updateFavoritesCount();
		
		window.addEventListener("cartChange", updateCartCount);
		window.addEventListener("favoritesUpdated", updateFavoritesCount);
		
		return () => {
			window.removeEventListener("cartChange", updateCartCount);
			window.removeEventListener("favoritesUpdated", updateFavoritesCount);
		};
	}, []);

	// Fetch categories for mobile menu
	useEffect(() => {
		let isMounted = true;
		api.getCategories()
			.then((data) => {
				if (isMounted) setCategories(data.filter((c) => c.is_active));
			})
			.catch((err) => {
				console.error("Failed to load categories:", err);
				if (isMounted) setCategories([]);
			});
		return () => {
			isMounted = false;
		};
	}, []);


	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<header className="w-full bg-white border-b border-black/10">

			{/* Main header */}
			<div className="mx-auto max-w-7xl px-4">
				<div className="flex items-center justify-between gap-4 py-4">
					{/* Left side - Hamburger menu and brand name on same line */}
					<div className="flex items-center gap-3">
						{/* Mobile menu button */}
						<button
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
						>
							{showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>

						{/* Logo - on same line as hamburger menu */}
						<Logo />
					</div>

					{/* Search bar - inline on desktop, hidden on mobile */}
					<div className="hidden md:block flex-1 max-w-2xl mx-8">
						<form onSubmit={handleSearch} className="flex items-center gap-3">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder={t('searchPlaceholder')}
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
								/>
								<button 
									type="submit"
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
								>
									<Search className="h-4 w-4" />
								</button>
							</div>
						</form>
					</div>

					{/* Right side - Action icons */}
					<div className="flex items-center gap-3 md:gap-6">
						{/* Favorites */}
						<Link href="/favorites" className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
							<Heart className="w-5 h-5" />
							{favoritesCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									{favoritesCount}
								</span>
							)}
						</Link>
						
						{/* Cart */}
						<Link href="/cart" className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
							<ShoppingBag className="w-5 h-5" />
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									{cartCount}
								</span>
							)}
						</Link>
						
						{/* User account - hidden on mobile */}
						<Link href="/account" className="hidden md:block p-2 hover:bg-black/5 rounded-full transition-colors">
							<User className="w-5 h-5" />
						</Link>
					</div>
				</div>

				{/* Search bar - full width below header on mobile only */}
				<div className="md:hidden pb-4">
					<form onSubmit={handleSearch} className="flex items-center gap-3">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder={t('searchPlaceholder')}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
							/>
							<button 
								type="submit"
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
							>
								<Search className="h-4 w-4" />
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Mobile menu - overlay with scrolling */}
			{showMobileMenu && (
				<div className="md:hidden fixed inset-0 bg-black/50 z-50">
					<div className="absolute top-0 left-0 w-80 h-full bg-white shadow-xl">
						<div className="h-full flex flex-col">
							{/* Header with close button */}
							<div className="p-4 border-b border-gray-100">
								<div className="flex justify-end">
									<button
										onClick={() => setShowMobileMenu(false)}
										className="p-2 hover:bg-black/5 rounded-full transition-colors"
									>
										<X className="w-6 h-6" />
									</button>
								</div>
							</div>

							{/* Scrollable content */}
							<div className="flex-1 overflow-y-auto p-4">

								{/* Categories */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-3 px-4">Categories</h3>
									<div className="space-y-2">
										{categories.map((c) => (
											<Link
												key={c.id}
												href={`/category/${c.slug}`}
												className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-lg transition-colors"
												onClick={() => setShowMobileMenu(false)}
											>
												<Image 
													src={c.image_url || "/icons/plates.png"} 
													alt={c.name_en}
													width={20}
													height={20}
													className="w-5 h-5 object-contain"
												/>
												<span>{c.name_en}</span>
											</Link>
										))}
									</div>
								</div>
								
								
								{/* Services */}
								<Link 
									href="/services" 
									className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-lg transition-colors"
									onClick={() => setShowMobileMenu(false)}
								>
									<Settings className="w-5 h-5" />
									Services
								</Link>

								{/* User account */}
								<Link 
									href="/account" 
									className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-lg transition-colors border-t border-gray-100 pt-4"
									onClick={() => setShowMobileMenu(false)}
								>
									<User className="w-5 h-5" />
									Account
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}


