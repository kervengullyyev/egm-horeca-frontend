"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authService, SignInData } from "@/lib/auth";
import { googleAuthService } from "@/lib/googleAuth";

export default function LoginPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState<SignInData>({
		email: "",
		password: ""
	});

	useEffect(() => {
		// Check if user is already authenticated
		if (authService.isAuthenticated()) {
			router.push('/dashboard');
		}

		// Initialize Google OAuth and render button
		const initGoogleOAuth = async () => {
			try {
				await googleAuthService.initialize();
				googleAuthService.renderButton('google-signin-container');
			} catch (error) {
				console.error('Failed to initialize Google OAuth:', error);
				setError('Failed to initialize Google OAuth. Please refresh the page.');
			}
		};

		initGoogleOAuth();
	}, [router]);

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await authService.signIn(formData);
			router.push("/dashboard"); // Redirect to dashboard after successful login
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Sign in failed. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Google SSO handler (currently unused but kept for future implementation)
	// const handleGoogleSSO = async () => {
	// 	setLoading(true);
	// 	setError("");

	// 	try {
	// 		// Initialize Google OAuth if not already done
	// 		if (!googleAuthService.isAvailable()) {
	// 			await googleAuthService.initialize();
	// 		}

	// 		// Trigger Google OAuth login
	// 		await googleAuthService.login();
			
	// 		// Note: The actual authentication will happen in the callback page
	// 		// This function just initiates the OAuth flow
	// 	} catch (err: unknown) {
	// 		const errorMessage = err instanceof Error ? err.message : "Google SSO failed. Please try again.";
	// 		setError(errorMessage);
	// 		setLoading(false);
	// 	}
	// };



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

					{/* Right Side - Sign In Form */}
					<div className="flex items-center justify-center">
						<div className="w-full max-w-md">
							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
							</div>

							{/* Error Display */}
							{error && (
								<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
									{error}
								</div>
							)}

							{/* Form Fields */}
							<form onSubmit={handleSubmit} className="space-y-3 mb-4">
								<div>
									<input
										type="email"
										placeholder="Email"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-sm"
									/>
								</div>

								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Password"
										value={formData.password}
										onChange={(e) => handleInputChange('password', e.target.value)}
										className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors text-sm"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									</button>
								</div>

								{/* Forgot Password Link */}
								<div className="text-right">
									<Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
										Forgot your password?
									</Link>
								</div>

								{/* Sign In Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? "Signing In..." : "Sign In"}
								</button>

								{/* Sign Up Link */}
								<p className="text-center text-gray-600 text-sm">
									Don&apos;t have an account?{" "}
									<Link href="/account" className="text-blue-600 hover:underline font-medium">Sign Up</Link>
								</p>
							</form>

							{/* Separator */}
							<div className="relative mb-4">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">Or</span>
								</div>
							</div>

							{/* Social Sign-in Button */}
							<div className="flex justify-center">
								<div id="google-signin-container"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
