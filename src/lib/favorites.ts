const STORAGE_KEY = "favorites";

export interface FavoriteItem {
	id: string;
	name: string;
	price: number;
	image?: string;
}

function readFromStorage(): FavoriteItem[] {
	if (typeof window === "undefined") return [];
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

function writeToStorage(items: FavoriteItem[]) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (error) {
		console.error('Error writing to localStorage:', error);
	}
}

export function getFavorites(): FavoriteItem[] {
	return readFromStorage();
}

export function setFavorites(items: FavoriteItem[]) {
	writeToStorage(items);
	notifyFavoritesChange();
}

export function addToFavorites(item: FavoriteItem) {
	const favorites = getFavorites();
	if (!favorites.find(f => f.id === item.id)) {
		favorites.push(item);
		setFavorites(favorites);
	}
}

export function removeFromFavorites(id: string) {
	const favorites = getFavorites();
	const filtered = favorites.filter(f => f.id !== id);
	setFavorites(filtered);
}

export function isFavorite(id: string): boolean {
	const favorites = getFavorites();
	return favorites.some(f => f.id === id);
}

export function toggleFavorite(item: FavoriteItem) {
	if (isFavorite(item.id)) {
		removeFromFavorites(item.id);
	} else {
		addToFavorites(item);
	}
}

function notifyFavoritesChange() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event("favoritesUpdated"));
	}
}
