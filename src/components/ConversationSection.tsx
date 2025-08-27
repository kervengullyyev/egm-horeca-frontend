export default function ConversationSection() {
	return (
		<section className="w-full">
			<div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
				<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
					<div>
						<h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
							Engage with Us in
							<br />
							Conversation.
						</h2>
						<p className="mt-6 max-w-xl text-sm leading-6 text-foreground/70">
							In a global world based on communication, a brand must look beyond its borders,
							open up to new experiences, and dare to be different. Meeting the brightest
							minds of one&apos;s time is the most effective way to nurture creativity.
						</p>
					</div>
					<div className="relative">
						<div className="aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-black/10 bg-gray-100">
							<div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.08),_transparent_55%)]" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


