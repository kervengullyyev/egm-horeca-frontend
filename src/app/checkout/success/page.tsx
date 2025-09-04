"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Package, Mail } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
	const [sessionId, setSessionId] = useState<string>("");
	const [sessionDetails, setSessionDetails] = useState<{
		status: string;
		receipt_url: string | null;
		amount: number | null;
		currency: string | null;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get session ID from URL parameters
		const urlParams = new URLSearchParams(window.location.search);
		const sessionIdParam = urlParams.get("session_id");
		if (sessionIdParam) {
			setSessionId(sessionIdParam);
			fetchSessionDetails(sessionIdParam);
		}
	}, []);

	const fetchSessionDetails = async (sessionId: string) => {
		try {
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			if (!apiBaseUrl) {
				throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable must be set');
			}
			
			const response = await fetch(`${apiBaseUrl}/api/v1/stripe/session/${sessionId}`);
			if (response.ok) {
				const data = await response.json();
				setSessionDetails(data);
			}
		} catch (error) {
			console.error('Error fetching session details:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen font-sans bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 py-16">
				<div className="text-center">
					{/* Success Icon */}
					<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-12 w-12 text-green-600" />
					</div>

					{/* Success Message */}
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
					<p className="text-lg text-gray-600 mb-8">
						Thank you for your order. {sessionDetails?.amount != null ? (
							<>Your payment of {sessionDetails.amount.toFixed(2)} RON has been processed successfully.</>
						) : (
							<>Your payment has been processed successfully.</>
						)}
					</p>

					{/* Order Details */}
					{sessionId && (
						<div className="mt-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
							{loading ? (
								<div className="text-center py-4">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
									<p className="mt-2 text-sm text-gray-500">Loading order details...</p>
								</div>
							) : sessionDetails ? (
								<div className="space-y-2 text-sm text-gray-600">
									{sessionDetails.receipt_url && (
										<div className="flex justify-between">
											<span>Receipt:</span>
											<a 
												href={sessionDetails.receipt_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:text-blue-800 underline font-medium"
											>
												View Receipt
											</a>
										</div>
									)}
									{sessionDetails.amount && (
										<div className="flex justify-between">
											<span>Amount:</span>
											<span className="font-medium">
												${sessionDetails.amount.toFixed(2)} {sessionDetails.currency}
											</span>
										</div>
									)}
									<div className="flex justify-between">
										<span>Status:</span>
										<span className={`font-medium ${
											sessionDetails.status === 'paid' ? 'text-green-600' : 'text-gray-600'
										}`}>
											{sessionDetails.status === 'paid' ? 'Paid' : sessionDetails.status}
										</span>
									</div>
								</div>
							) : (
								<div className="text-center py-4">
									<p className="text-sm text-gray-500">Unable to load order details</p>
								</div>
							)}
						</div>
					)}

					{/* Next Steps */}
					<div className="mt-8 space-y-4">
						<div className="flex items-center justify-center space-x-2 text-gray-600">
							<Package className="h-5 w-5" />
							<span>We&apos;ll start processing your order immediately</span>
						</div>
						<div className="flex items-center justify-center space-x-2 text-gray-600">
							<Mail className="h-5 w-5" />
							<span>You&apos;ll receive a confirmation email shortly</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/"
							className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
						>
							Continue Shopping
						</Link>
						<Link
							href="/orders"
							className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
						>
							View Orders
						</Link>
					</div>

					{/* Support Info */}
					<div className="mt-12 p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							Need help? Contact our support team at{" "}
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
