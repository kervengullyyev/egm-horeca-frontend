"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X, Settings } from "lucide-react";
import { getCart } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";
import { useTranslation } from "react-i18next";
import { api, type Category, type Product } from "@/lib/api";
import Logo from "./Logo";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
	const [query, setQuery] = useState("");
	const [cartCount, setCartCount] = useState(0);
	const [favoritesCount, setFavoritesCount] = useState(0);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

	// Debounced search function
	const performSearch = useCallback(async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		setIsSearching(true);
		try {
			const results = await api.getProducts({
				search: searchQuery,
				active_only: true,
				limit: 8 // Limit results for dropdown
			});
			setSearchResults(results);
			setShowSearchResults(true);
		} catch (error) {
			console.error('Error performing search:', error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	}, []);

	// Handle search input change with debouncing
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);

		// Clear previous timeout
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		// Set new timeout for debounced search
		searchTimeoutRef.current = setTimeout(() => {
			performSearch(value);
		}, 300); // 300ms debounce
	};

	// Handle search form submission
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			setShowSearchResults(false);
		}
	};

	// Hide search results when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.search-container')) {
				setShowSearchResults(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

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
					<div className="hidden md:block flex-1 max-w-2xl mx-8 search-container">
						<form onSubmit={handleSearch} className="flex items-center gap-3">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder={t('searchPlaceholder')}
									value={query}
									onChange={handleSearchInputChange}
									className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
								/>
								<button 
									type="submit"
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
								>
									<Search className="h-4 w-4" />
								</button>
								
								{/* Search Results Dropdown */}
								{showSearchResults && (
									<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
										{isSearching ? (
											<div className="py-2">
												{Array.from({ length: 3 }).map((_, index) => (
													<div key={index} className="flex items-center gap-3 p-3">
														<Skeleton className="w-10 h-10 rounded" />
														<div className="flex-1 min-w-0">
															<Skeleton className="h-4 w-3/4 mb-1" />
															<Skeleton className="h-3 w-1/4" />
														</div>
													</div>
												))}
											</div>
										) : searchResults.length > 0 ? (
											<div className="py-2">
												{searchResults.map((product) => (
													<Link
														key={product.id}
														href={`/product/${product.slug}`}
														className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
														onClick={() => setShowSearchResults(false)}
													>
														{product.images && product.images.length > 0 ? (
															<Image
																src={product.images[0]}
																alt={product.name_en}
																width={40}
																height={40}
																className="w-10 h-10 object-cover rounded"
															/>
														) : (
															<div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
																<Search className="w-4 h-4 text-gray-400" />
															</div>
														)}
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-gray-900 truncate">
																{product.name_en}
															</p>
															<p className="text-sm text-gray-500">
																{product.price} RON
															</p>
														</div>
													</Link>
												))}
												{query.trim() && (
													<div className="border-t border-gray-100 p-2">
														<Link
															href={`/search?q=${encodeURIComponent(query.trim())}`}
															className="block w-full text-center py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
															onClick={() => setShowSearchResults(false)}
														>
															View all results for &quot;{query}&quot;
														</Link>
													</div>
												)}
											</div>
										) : query.trim() ? (
											<div className="p-4 text-center text-gray-500">
												<p className="text-sm">No products found</p>
											</div>
										) : null}
									</div>
								)}
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
				<div className="md:hidden pb-4 search-container">
					<form onSubmit={handleSearch} className="flex items-center gap-3">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder={t('searchPlaceholder')}
								value={query}
								onChange={handleSearchInputChange}
								className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none pr-10"
							/>
							<button 
								type="submit"
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
							>
								<Search className="h-4 w-4" />
							</button>
							
							{/* Mobile Search Results Dropdown */}
							{showSearchResults && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
									{isSearching ? (
										<div className="py-2">
											{Array.from({ length: 3 }).map((_, index) => (
												<div key={index} className="flex items-center gap-3 p-3">
													<Skeleton className="w-10 h-10 rounded" />
													<div className="flex-1 min-w-0">
														<Skeleton className="h-4 w-3/4 mb-1" />
														<Skeleton className="h-3 w-1/4" />
													</div>
												</div>
											))}
										</div>
									) : searchResults.length > 0 ? (
										<div className="py-2">
											{searchResults.map((product) => (
												<Link
													key={product.id}
													href={`/product/${product.slug}`}
													className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
													onClick={() => setShowSearchResults(false)}
												>
													{product.images && product.images.length > 0 ? (
														<Image
															src={product.images[0]}
															alt={product.name_en}
															width={40}
															height={40}
															className="w-10 h-10 object-cover rounded"
														/>
													) : (
														<div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
															<Search className="w-4 h-4 text-gray-400" />
														</div>
													)}
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">
															{product.name_en}
														</p>
														<p className="text-sm text-gray-500">
															{product.price} RON
														</p>
													</div>
												</Link>
											))}
											{query.trim() && (
												<div className="border-t border-gray-100 p-2">
													<Link
														href={`/search?q=${encodeURIComponent(query.trim())}`}
														className="block w-full text-center py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
														onClick={() => setShowSearchResults(false)}
													>
														View all results for &quot;{query}&quot;
													</Link>
												</div>
											)}
										</div>
									) : query.trim() ? (
										<div className="p-4 text-center text-gray-500">
											<p className="text-sm">No products found</p>
										</div>
									) : null}
								</div>
							)}
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


