export default function PromoBanner() {
	return (
		<section className="mt-12">
			<div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-gray-100">
				<div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:py-12 sm:px-8 lg:grid-cols-2">
					{/* Left visual placeholder (product image area) */}
					<div className="relative">
						<div className="relative mx-auto h-[240px] w-full max-w-[540px] sm:h-[300px]">
							{/* Placeholder for product image */}
							<div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
								<div className="text-center text-gray-500">
									<div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
										<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
										</svg>
									</div>
									<p className="text-sm font-medium">Product Image</p>
									<p className="text-xs text-gray-400">Placeholder</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right content */}
					<div className="max-w-xl">
						<p className="text-xs font-semibold tracking-wider text-foreground/70">BEST SELLER PRODUCT</p>
						<h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Winter Sale Kitchen</h3>
						<p className="mt-3 text-sm leading-6 text-foreground/70">A mighty meaty double helping of all the reasons you love our burger.</p>
						<div className="mt-6">
							<button className="inline-flex items-center justify-center rounded-md border border-black px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-black hover:text-white">
								SHOP NOW
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


