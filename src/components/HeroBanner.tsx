import { Play, ArrowRight } from "lucide-react";

export default function HeroBanner() {
	return (
		<section className="w-full">
			<div className="py-4 sm:py-8 md:py-1">
				<div className="relative overflow-hidden rounded-[20px]">
					{/* Banner image background */}
					<div className="aspect-[16/9] sm:aspect-[16/7] w-full bg-[url('/banner.jpg')] bg-cover bg-center" />
					<div className="absolute inset-0 bg-black/30" />

					<div className="pointer-events-none absolute inset-x-4 sm:inset-x-6 top-1/4 sm:top-1/3 md:inset-x-10">
						<h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white text-center drop-shadow-md">Contemporary</h1>
					</div>

					<div className="absolute bottom-3 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:gap-6">
						<div className="rounded-2xl bg-white/10 p-3 sm:p-5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-white/20 backdrop-blur-md sm:max-w-md">
							<p className="text-xs sm:text-sm leading-6 text-white">Crafting spaces that harmonize modern aesthetics with timeless elegance, our contemporary interior designs breathe life into every room, redefining the essence of chic living.</p>
							<button className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-black hover:bg-white">
								View More
								<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
							</button>
						</div>

						<div className="relative hidden overflow-hidden rounded-2xl bg-black/30 p-2 shadow ring-1 ring-white/20 sm:block">
							<div className="relative h-28 w-52 overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center">
								<button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow">
									<Play className="h-5 w-5" />
								</button>
								<div className="text-center text-gray-500">
									<div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
										<svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
										</svg>
									</div>
									<p className="text-xs">Video</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


