"use client";

import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
	return (
		<main className="min-h-screen font-sans bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 py-16">
				<div className="text-center">
					{/* Cancel Icon */}
					<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
						<XCircle className="h-12 w-12 text-red-600" />
					</div>

					{/* Cancel Message */}
					<h1 className="mt-8 text-3xl font-bold text-gray-900">
						Payment Cancelled
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Your payment was cancelled. No charges were made to your account.
					</p>

					{/* What Happened */}
					<div className="mt-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">What Happened?</h2>
						<div className="space-y-3 text-sm text-gray-600 text-left">
							<div className="flex items-start space-x-3">
								<XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
								<span>You cancelled the payment process on Stripe</span>
							</div>
							<div className="flex items-start space-x-3">
								<ShoppingCart className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
								<span>Your cart items are still saved and ready for checkout</span>
							</div>
							<div className="flex items-start space-x-3">
								<ArrowLeft className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
								<span>You can return to checkout anytime</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/cart"
							className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
						>
							Return to Cart
						</Link>
						<Link
							href="/"
							className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
						>
							Continue Shopping
						</Link>
					</div>

					{/* Support Info */}
					<div className="mt-12 p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							Having trouble with checkout? Contact our support team at{" "}
							<a href="mailto:support@egmhoreca.com" className="font-medium underline">
								support@egmhoreca.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
