import AccountForm from "@/components/AccountForm";

export default function AccountPage() {
	return (
		<main className="min-h-screen font-sans">
			<div className="mx-auto max-w-7xl px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Left Side - Placeholder Image */}
					<div className="bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center min-h-[600px]">
						<div className="text-center p-8">
							<div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
								</svg>
							</div>
							<p className="text-gray-600 text-lg font-medium mb-2">Placeholder Image</p>
							<p className="text-gray-500 text-sm">Left Sidebar Area</p>
						</div>
					</div>

					{/* Right Side - Sign Up Form */}
					<AccountForm />
				</div>
			</div>
		</main>
	);
}
