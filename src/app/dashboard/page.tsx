"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export default function DashboardPage() {
	const router = useRouter();
	// const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string } | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("personal-info");
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		gender: "female"
	});

	useEffect(() => {
		// Check if user is authenticated
		if (!authService.isAuthenticated()) {
			router.push("/login");
			return;
		}

		// Get user data
		const userData = authService.getUser();
		if (userData) {
			setFormData({
				firstName: userData.firstName || "",
				lastName: userData.lastName || "",
				email: userData.email || "",
				phone: userData.phone || "",
				gender: "female"
			});
		}
		setLoading(false);
	}, [router]);

	const handleSignOut = async () => {
		await authService.signOut();
		router.push("/login");
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleUpdateChanges = () => {
		// TODO: Implement update functionality
		console.log("Updating user data:", formData);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">


				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Left Column - Navigation Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<nav className="space-y-2">
								<button
									onClick={() => setActiveSection("personal-info")}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
										activeSection === "personal-info"
											? "bg-primary text-primary-foreground"
											: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									Personal Information
								</button>
								<button
									onClick={() => setActiveSection("orders")}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
										activeSection === "orders"
											? "bg-primary text-primary-foreground"
											: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									My Orders
								</button>
								<button
									onClick={() => setActiveSection("address")}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
										activeSection === "address"
											? "bg-primary text-primary-foreground"
											: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									Manage Address
								</button>
								<button
									onClick={() => setActiveSection("payment")}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
										activeSection === "payment"
											? "bg-primary text-primary-foreground"
											: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									Payment Method
								</button>
								<button
									onClick={() => setActiveSection("password")}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
										activeSection === "password"
											? "bg-primary text-primary-foreground"
											: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									Password Manager
								</button>
								
								{/* Divider */}
								<div className="border-t border-gray-200 my-4"></div>
								
								{/* Logout Button */}
								<button
									onClick={handleSignOut}
									className="w-full text-left px-4 py-3 rounded-lg font-medium bg-gray-600 text-primary-foreground hover:bg-primary transition-colors"
								>
									Logout
								</button>
							</nav>
						</div>
					</div>

					{/* Right Column - Main Content Area */}
					<div className="lg:col-span-3">
						{activeSection === "personal-info" && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
								
								<form className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												First Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												value={formData.firstName}
												onChange={(e) => handleInputChange('firstName', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
												placeholder="Enter first name"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Last Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												value={formData.lastName}
												onChange={(e) => handleInputChange('lastName', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
												placeholder="Enter last name"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Email <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												value={formData.email}
												onChange={(e) => handleInputChange('email', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
												placeholder="Enter email address"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Phone <span className="text-red-500">*</span>
											</label>
											<input
												type="tel"
												value={formData.phone}
												onChange={(e) => handleInputChange('phone', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
												placeholder="Enter phone number"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Gender <span className="text-red-500">*</span>
										</label>
										<select
											value={formData.gender}
											onChange={(e) => handleInputChange('gender', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-colors"
										>
											<option value="female">Female</option>
											<option value="male">Male</option>
											<option value="other">Other</option>
											<option value="prefer-not-to-say">Prefer not to say</option>
										</select>
									</div>

									<div className="pt-4">
										<button
											type="button"
											onClick={handleUpdateChanges}
											className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
										>
											Update Changes
										</button>
									</div>
								</form>
							</div>
						)}

						{activeSection === "orders" && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
								<p className="text-gray-600">Order history will be displayed here.</p>
							</div>
						)}

						{activeSection === "address" && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Address</h2>
								<p className="text-gray-600">Address management will be displayed here.</p>
							</div>
						)}

						{activeSection === "payment" && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
								<p className="text-gray-600">Payment methods will be displayed here.</p>
							</div>
						)}

						{activeSection === "password" && (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-6">Password Manager</h2>
								<p className="text-gray-600">Password management will be displayed here.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
