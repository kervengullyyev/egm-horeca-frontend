import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

type ProductCardServerProps = {
	title: string;
	shortDescription?: string;
	price: number;
	imageUrl?: string;
	images?: string[];
	href?: string;
	productId?: string | number;
	favoriteSlot?: React.ReactNode;
	actionsSlot?: React.ReactNode;
};

export default function ProductCardServer({
	title,
	shortDescription,
	price,
	imageUrl,
	images,
	href,
	favoriteSlot,
	actionsSlot,
}: ProductCardServerProps) {
	const displayImage = images && images.length > 0 ? images[0] : imageUrl;

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
								priority={false}
								loading="lazy"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
								placeholder="blur"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							/>
						) : null}
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
								priority={false}
								loading="lazy"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
								placeholder="blur"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							/>
						) : null}
						<div 
							className={`aspect-[4/5] w-full rounded-md bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${displayImage ? 'hidden' : 'flex'}`}
						>
							<ImageIcon className="h-12 w-12 text-gray-400" />
						</div>
					</>
				)}

				{favoriteSlot ? (
					<div className="absolute right-1 top-1">
						{favoriteSlot}
					</div>
				) : null}
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

				<div className="mt-4">
					<div className="rounded-full bg-black/5 px-3 py-1.5 text-base font-semibold inline-block">{price} RON</div>
				</div>

				<div className="mt-3">
					{actionsSlot}
				</div>
			</div>
		</article>
	);
}


