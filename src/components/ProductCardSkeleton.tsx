import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
	return (
		<article className="rounded-2xl border border-black/10 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
			<div className="relative m-2 overflow-hidden rounded-lg">
				{/* Image skeleton */}
				<Skeleton className="aspect-[4/5] w-full rounded-lg" />
			</div>

			<div className="px-3 pb-3 pt-1">
				{/* Title skeleton */}
				<Skeleton className="h-6 w-3/4 mb-2" />
				
				{/* Description skeleton */}
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-2/3 mb-4" />

				{/* Price skeleton */}
				<Skeleton className="h-8 w-20 rounded-full mb-3" />

				{/* Button skeleton */}
				<Skeleton className="h-10 w-full rounded-full" />
			</div>
		</article>
	);
}
