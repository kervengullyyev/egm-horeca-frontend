"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authService, ResetPasswordData } from "@/lib/auth";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState<ResetPasswordData>({
		token: "",
		new_password: ""
	});
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const token = searchParams.get('token');
		if (!token) {
			setError("Invalid reset link. Please request a new password reset.");
			return;
		}
		setFormData(prev => ({ ...prev, token }));
	}, [searchParams]);

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validate token exists
		if (!formData.token) {
			setError("Invalid reset link. Please request a new password reset.");
			setLoading(false);
			return;
		}

		// Validate passwords match
		if (formData.new_password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password length
		if (formData.new_password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		// Validate password contains at least one character (not just spaces)
		if (formData.new_password.trim().length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		try {
			await authService.resetPassword(formData);
			setSuccess(true);
		} catch (err: unknown) {
			console.error('Reset password error:', err);
			let errorMessage = "Failed to reset password. Please try again.";
			
			if (err instanceof Error) {
				errorMessage = err.message;
			} else if (typeof err === 'string') {
				errorMessage = err;
			} else if (err && typeof err === 'object') {
				// Handle object errors
				if ('message' in err && typeof err.message === 'string') {
					errorMessage = err.message;
				} else if ('detail' in err && typeof err.detail === 'string') {
					errorMessage = err.detail;
				} else {
					errorMessage = JSON.stringify(err);
				}
			}
			
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center">
						<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
							<svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Password Reset Successful
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Your password has been successfully reset. You can now log in with your new password.
						</p>
						<div className="mt-6">
							<Link
								href="/login"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
							>
								Go to Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Reset your password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your new password below.
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
								New Password
							</label>
							<div className="mt-1 relative">
							<input
								id="newPassword"
								name="newPassword"
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								required
								className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
								placeholder="Enter new password"
								value={formData.new_password}
								onChange={(e) => handleInputChange("new_password", e.target.value)}
							/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirm New Password
							</label>
							<div className="mt-1 relative">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									required
									className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
						</div>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-red-800">
										Error
									</h3>
									<div className="mt-2 text-sm text-red-700">
										{error}
									</div>
								</div>
							</div>
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={loading || !formData.token}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<>
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Resetting...
								</>
							) : (
								"Reset Password"
							)}
						</button>
					</div>

					<div className="text-center">
						<Link
							href="/login"
							className="font-medium text-green-600 hover:text-green-500"
						>
							← Back to Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
