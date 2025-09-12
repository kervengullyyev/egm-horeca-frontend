"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

type FavoriteButtonProps = {
	id: string;
	name: string;
	price: number;
	image?: string;
	ariaLabel?: string;
};

export default function FavoriteButton({ id, name, price, image, ariaLabel }: FavoriteButtonProps) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		setActive(isFavorite(id));
		const handler = () => setActive(isFavorite(id));
		window.addEventListener("favoritesUpdated", handler);
		return () => window.removeEventListener("favoritesUpdated", handler);
	}, [id]);

	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setActive(!active);
				toggleFavorite({ id, name, price, image });
			}}
			className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow hover:bg-gray-50 transition-colors"
			aria-label={ariaLabel || 'Toggle favorite'}
		>
			<Heart className={`h-5 w-5 ${active ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
		</button>
	);
}


