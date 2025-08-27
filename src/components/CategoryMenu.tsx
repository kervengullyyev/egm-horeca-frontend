"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, type Category } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CategoryMenu() {
	const { currentLanguage } = useLanguage();
	const [categories, setCategories] = useState<Category[]>([]);

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

	return (
		<nav className="hidden md:block w-full border-b border-black/10 bg-white">
			<div className="mx-auto max-w-7xl px-4">
				<ul className="flex gap-6 overflow-x-auto py-3 text-sm text-foreground/80 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{categories.map((c) => (
						<li key={c.id} className="shrink-0">
							<Link href={`/category/${c.slug}`} className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground">
								<Image 
									src={c.image_url || "/icons/plates.png"} 
									alt={currentLanguage === 'ro' ? (c.name_ro || c.name_en) : c.name_en}
									width={20}
									height={20}
									className="w-5 h-5 object-contain"
								/>
								<span>{currentLanguage === 'ro' ? (c.name_ro || c.name_en) : c.name_en}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}


