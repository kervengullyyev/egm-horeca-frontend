import { ArrowUpRight } from "lucide-react";

type CollectionItem = {
	name: string;
};

const items: CollectionItem[] = [
	{ name: "Professional Series" },
	{ name: "Premium Collection" },
	{ name: "Chef's Choice" },
	{ name: "Restaurant Grade" },
	{ name: "Hotel Collection" },
	{ name: "Café Essentials" },
];

function CollectionCard({ name }: { name: string }) {
	return (
		<div className="relative overflow-hidden rounded-[20px] bg-gray-200">
			{/* image placeholder */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.18),_transparent_60%)]" />
			<div className="relative flex h-[220px] w-full items-end justify-between p-4">
				<p className="text-base font-semibold text-primary-foreground drop-shadow">{name}</p>
				<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black shadow">
					<ArrowUpRight className="h-4 w-4" />
				</span>
			</div>
		</div>
	);
}

export default function CollectionShowcase() {
	return (
		<section className="mt-12">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
					<h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
						Explore Our Premium
						<br /> Collections
					</h2>
					<div className="max-w-md">
						<div className="flex justify-end">
							<button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
								View More
								<ArrowUpRight className="h-4 w-4" />
							</button>
						</div>
						<p className="mt-3 text-sm leading-6 text-foreground/70">
							Discover our carefully curated collections designed for professional kitchens, restaurants, hotels, and cafés. Quality tableware that elevates every dining experience.
						</p>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((it) => (
						<CollectionCard key={it.name + Math.random()} name={it.name} />
					))}
				</div>
			</div>
		</section>
	);
}


