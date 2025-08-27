export type CartCookieItem = {
	id: string;
	slug?: string;
	name: string;
	price: number;
	qty: number;
	size?: string | null;
	image?: string | null;
	variants?: Record<string, { name_en: string; value_en: string; price: number }>;
};

const COOKIE_NAME = "cart";
const COOKIE_MAX_AGE_DAYS = 7;

function readCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie
		.split("; ")
		.find((row) => row.startsWith(name + "="));
	return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function writeCookie(name: string, value: string, days = COOKIE_MAX_AGE_DAYS) {
	if (typeof document === "undefined") return;
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
}

function notifyCartChange() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("cartChange"));
	}
}

export function getCart(): CartCookieItem[] {
	try {
		const raw = readCookie(COOKIE_NAME);
		return raw ? (JSON.parse(raw) as CartCookieItem[]) : [];
	} catch {
		return [];
	}
}

export function setCart(items: CartCookieItem[]) {
	writeCookie(COOKIE_NAME, JSON.stringify(items));
	notifyCartChange();
}

export function addToCart(item: CartCookieItem) {
	const items = getCart();
	const idx = items.findIndex(
		(it) => it.id === item.id && 
		(it.size || null) === (item.size || null) &&
		JSON.stringify(it.variants || {}) === JSON.stringify(item.variants || {})
	);
	if (idx >= 0) {
		items[idx].qty += item.qty;
	} else {
		items.push(item);
	}
	setCart(items);
}

export function updateQty(id: string, size: string | null | undefined, qty: number, variants?: Record<string, { name_en: string; value_en: string; price: number }>) {
	const items = getCart();
	const idx = items.findIndex((it) => it.id === id && 
		(it.size || null) === (size || null) &&
		JSON.stringify(it.variants || {}) === JSON.stringify(variants || {})
	);
	if (idx >= 0) {
		items[idx].qty = Math.max(1, qty);
		setCart(items);
	}
}

export function removeFromCart(id: string, size: string | null | undefined, variants?: Record<string, { name_en: string; value_en: string; price: number }>) {
	const items = getCart().filter((it) => !(it.id === id && 
		(it.size || null) === (size || null) &&
		JSON.stringify(it.variants || {}) === JSON.stringify(variants || {})
	));
	setCart(items);
}

export function clearCart() {
	setCart([]);
}
