"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Category } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CategoryMenuClientProps {
	categories: Category[];
}

export default function CategoryMenuClient({ categories }: CategoryMenuClientProps) {
	const { currentLanguage } = useLanguage();
	const [api, setApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCanScrollPrev(api.canScrollPrev());
			setCanScrollNext(api.canScrollNext());
		};

		onSelect();
		api.on("reInit", onSelect);
		api.on("select", onSelect);

		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	return (
		<nav className="hidden md:block w-full border-b border-black/10 bg-white">
			<div className="mx-auto max-w-7xl px-4">
				<div className="relative py-3 flex items-center">
					<Carousel
						opts={{
							align: "start",
							loop: false,
						}}
						className="w-full"
						setApi={setApi}
					>
						<CarouselContent className="-ml-2 md:-ml-4 flex items-center">
							{categories.map((c) => (
								<CarouselItem key={c.id} className="pl-2 md:pl-4 basis-auto flex items-center">
									<Link 
										href={`/category/${c.slug}`} 
										className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground text-sm text-foreground/80"
									>
										<Image 
											src={c.image_url || "/icons/plates.png"} 
											alt={currentLanguage === 'ro' ? (c.name_ro || c.name_en) : c.name_en}
											width={20}
											height={20}
											className="w-5 h-5 object-contain"
										/>
										<span>{currentLanguage === 'ro' ? (c.name_ro || c.name_en) : c.name_en}</span>
									</Link>
								</CarouselItem>
							))}
						</CarouselContent>
						{canScrollPrev && (
							<Button
								variant="outline"
								size="sm"
								className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex h-6 w-6 backdrop-blur-sm bg-white/80 border-white/20"
								onClick={() => api?.scrollPrev()}
							>
								<ArrowLeft className="h-3 w-3" />
								<span className="sr-only">Previous slide</span>
							</Button>
						)}
						{canScrollNext && (
							<Button
								variant="outline"
								size="sm"
								className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex h-6 w-6 backdrop-blur-sm bg-white/80 border-white/20"
								onClick={() => api?.scrollNext()}
							>
								<ArrowRight className="h-3 w-3" />
								<span className="sr-only">Next slide</span>
							</Button>
						)}
					</Carousel>
				</div>
			</div>
		</nav>
	);
}


