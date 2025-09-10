"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
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
		gender: "female",
		entityType: "individual",
		taxId: "",
		companyName: "",
		tradeRegisterNo: "",
		bank: "",
		iban: "",
		county: "",
		city: "",
		address: ""
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
			setFormData(prev => ({
				...prev,
				firstName: userData.firstName || "",
				lastName: userData.lastName || "",
				email: userData.email || "",
				phone: userData.phone || ""
			}));
		}
		setLoading(false);
	}, [router]);

	// Load user profile data when address section is accessed
	useEffect(() => {
		const loadUserProfile = async () => {
			if (activeSection === "address") {
				try {
					const profile = await authService.getUserProfile();
					setFormData(prev => ({
						...prev,
						entityType: profile.entity_type || "individual",
						taxId: profile.tax_id || "",
						companyName: profile.company_name || "",
						tradeRegisterNo: profile.trade_register_no || "",
						bank: profile.bank_name || "",
						iban: profile.iban || "",
						county: profile.county || "",
						city: profile.city || "",
						address: profile.address || ""
					}));
				} catch (error) {
					console.error("Error loading user profile:", error);
					// Don't show error to user, just log it
				}
			}
		};

		loadUserProfile();
	}, [activeSection]);

	const handleSignOut = async () => {
		await authService.signOut();
		router.push("/login");
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleUpdateChanges = async () => {
		try {
			// Validate required fields based on section
			if (activeSection === "personal-info") {
				if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
					toast.error("Please fill in all required fields");
					return;
				}
				// TODO: Implement personal info update
				console.log("Updating personal info:", formData);
				toast.success("Personal information updated successfully!");
			} else if (activeSection === "address") {
				// Validate required contact fields
				if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
					toast.error("Please fill in all required contact fields");
					return;
				}
				
				// Validate required address fields
				if (!formData.county || !formData.city || !formData.address) {
					toast.error("Please fill in all required address fields");
					return;
				}
				
				// Validate required company fields if entity type is company
				if (formData.entityType === "company") {
					if (!formData.taxId || !formData.companyName) {
						toast.error("Please fill in all required company fields");
						return;
					}
				}
				
				// Show loading toast
				const loadingToast = toast.loading("Saving address information...");
				
				// Prepare address data for API call
				const addressData = {
					entity_type: formData.entityType,
					tax_id: formData.taxId || undefined,
					company_name: formData.companyName || undefined,
					trade_register_no: formData.tradeRegisterNo || undefined,
					bank_name: formData.bank || undefined,
					iban: formData.iban || undefined,
					county: formData.county,
					city: formData.city,
					address: formData.address
				};
				
				// Call the API to save address
				await authService.updateAddress(addressData);
				
				// Dismiss loading toast and show success
				toast.dismiss(loadingToast);
				toast.success("Address information saved successfully!", {
					description: "Your address details have been updated and will be used for future orders.",
					duration: 4000,
				});
			}
		} catch (error) {
			console.error("Error updating:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to update information. Please try again.";
			toast.error("Failed to save address", {
				description: errorMessage,
				duration: 5000,
			});
		}
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
								
								{/* Entity Type Selection */}
								<div className="mb-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">Entity Type</h3>
									<div className="space-y-3">
										<div className="flex items-center">
											<input
												type="radio"
												id="individual"
												name="entityType"
												value="individual"
												checked={formData.entityType === "individual"}
												onChange={(e) => handleInputChange("entityType", e.target.value)}
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
											/>
											<label htmlFor="individual" className="ml-3 text-sm font-medium text-gray-700">
												Individual Person
											</label>
										</div>
										<div className="flex items-center">
											<input
												type="radio"
												id="company"
												name="entityType"
												value="company"
												checked={formData.entityType === "company"}
												onChange={(e) => handleInputChange("entityType", e.target.value)}
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
											/>
											<label htmlFor="company" className="ml-3 text-sm font-medium text-gray-700">
												Legal Entity / Company
											</label>
										</div>
									</div>
								</div>

								{/* Contact Information */}
								<div className="mb-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
												First Name *
											</label>
											<input
												type="text"
												id="firstName"
												value={formData.firstName}
												onChange={(e) => handleInputChange("firstName", e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter first name"
											/>
										</div>
										<div>
											<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
												Last Name *
											</label>
											<input
												type="text"
												id="lastName"
												value={formData.lastName}
												onChange={(e) => handleInputChange("lastName", e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter last name"
											/>
										</div>
										<div>
											<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
												Phone *
											</label>
											<input
												type="tel"
												id="phone"
												value={formData.phone}
												onChange={(e) => handleInputChange("phone", e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter phone number"
											/>
										</div>
										<div>
											<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
												Email *
											</label>
											<input
												type="email"
												id="email"
												value={formData.email}
												onChange={(e) => handleInputChange("email", e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter email address"
											/>
										</div>
									</div>
								</div>

								{/* Company Information - Only show for company entity type */}
								{formData.entityType === "company" && (
									<div className="mb-6">
										<h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
													Company Name *
												</label>
												<input
													type="text"
													id="companyName"
													value={formData.companyName}
													onChange={(e) => handleInputChange("companyName", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder="Enter company name"
												/>
											</div>
											<div>
												<label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
													Tax ID *
												</label>
												<input
													type="text"
													id="taxId"
													value={formData.taxId}
													onChange={(e) => handleInputChange("taxId", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder="Enter tax ID"
												/>
											</div>
											<div>
												<label htmlFor="tradeRegisterNo" className="block text-sm font-medium text-gray-700 mb-2">
													Trade Register No.
												</label>
												<input
													type="text"
													id="tradeRegisterNo"
													value={formData.tradeRegisterNo}
													onChange={(e) => handleInputChange("tradeRegisterNo", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder="Enter trade register number"
												/>
											</div>
											<div>
												<label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
													Bank Name
												</label>
												<input
													type="text"
													id="bank"
													value={formData.bank}
													onChange={(e) => handleInputChange("bank", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder="Enter bank name"
												/>
											</div>
											<div className="md:col-span-2">
												<label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
													IBAN
												</label>
												<input
													type="text"
													id="iban"
													value={formData.iban}
													onChange={(e) => handleInputChange("iban", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder="Enter IBAN"
												/>
											</div>
										</div>
									</div>
								)}

								{/* Address Information */}
								<div className="mb-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-2">
												County *
											</label>
											<div className="relative">
												<select
													id="county"
													value={formData.county}
													onChange={(e) => handleInputChange("county", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
												>
													<option value="">Choose a county...</option>
													<option value="Alba">Alba</option>
													<option value="Arad">Arad</option>
													<option value="Argeș">Argeș</option>
													<option value="Bacău">Bacău</option>
													<option value="Bihor">Bihor</option>
													<option value="Bistrița-Năsăud">Bistrița-Năsăud</option>
													<option value="Botoșani">Botoșani</option>
													<option value="Brașov">Brașov</option>
													<option value="Brăila">Brăila</option>
													<option value="Buzău">Buzău</option>
													<option value="Călărași">Călărași</option>
													<option value="Caraș-Severin">Caraș-Severin</option>
													<option value="Cluj">Cluj</option>
													<option value="Constanța">Constanța</option>
													<option value="Covasna">Covasna</option>
													<option value="Dâmbovița">Dâmbovița</option>
													<option value="Dolj">Dolj</option>
													<option value="Galați">Galați</option>
													<option value="Giurgiu">Giurgiu</option>
													<option value="Gorj">Gorj</option>
													<option value="Harghita">Harghita</option>
													<option value="Hunedoara">Hunedoara</option>
													<option value="Ialomița">Ialomița</option>
													<option value="Iași">Iași</option>
													<option value="Ilfov">Ilfov</option>
													<option value="Maramureș">Maramureș</option>
													<option value="Mehedinți">Mehedinți</option>
													<option value="Mureș">Mureș</option>
													<option value="Neamț">Neamț</option>
													<option value="Olt">Olt</option>
													<option value="Prahova">Prahova</option>
													<option value="Sălaj">Sălaj</option>
													<option value="Satu Mare">Satu Mare</option>
													<option value="Sibiu">Sibiu</option>
													<option value="Suceava">Suceava</option>
													<option value="Teleorman">Teleorman</option>
													<option value="Timiș">Timiș</option>
													<option value="Tulcea">Tulcea</option>
													<option value="Vâlcea">Vâlcea</option>
													<option value="Vaslui">Vaslui</option>
													<option value="Vrancea">Vrancea</option>
													<option value="Bucharest">Bucharest</option>
												</select>
												<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
											</div>
										</div>
										<div>
											<label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
												City *
											</label>
											<div className="relative">
												<select
													id="city"
													value={formData.city}
													onChange={(e) => handleInputChange("city", e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
												>
													<option value="">Choose a city...</option>
													<option value="Bucharest">Bucharest</option>
													<option value="Cluj-Napoca">Cluj-Napoca</option>
													<option value="Timișoara">Timișoara</option>
													<option value="Constanța">Constanța</option>
													<option value="Brașov">Brașov</option>
													<option value="Craiova">Craiova</option>
													<option value="Galați">Galați</option>
													<option value="Ploiești">Ploiești</option>
													<option value="Oradea">Oradea</option>
													<option value="Brăila">Brăila</option>
													<option value="Arad">Arad</option>
													<option value="Pitești">Pitești</option>
													<option value="Sibiu">Sibiu</option>
													<option value="Bacău">Bacău</option>
													<option value="Târgu Mureș">Târgu Mureș</option>
													<option value="Baia Mare">Baia Mare</option>
													<option value="Buzău">Buzău</option>
													<option value="Satu Mare">Satu Mare</option>
													<option value="Piatra Neamț">Piatra Neamț</option>
													<option value="Râmnicu Vâlcea">Râmnicu Vâlcea</option>
													<option value="Drobeta-Turnu Severin">Drobeta-Turnu Severin</option>
													<option value="Suceava">Suceava</option>
													<option value="Botoșani">Botoșani</option>
													<option value="Târgoviște">Târgoviște</option>
													<option value="Focșani">Focșani</option>
													<option value="Bistrița">Bistrița</option>
													<option value="Tulcea">Tulcea</option>
													<option value="Reșița">Reșița</option>
													<option value="Slatina">Slatina</option>
													<option value="Călărași">Călărași</option>
													<option value="Alba Iulia">Alba Iulia</option>
													<option value="Giurgiu">Giurgiu</option>
													<option value="Deva">Deva</option>
													<option value="Hunedoara">Hunedoara</option>
													<option value="Zalău">Zalău</option>
													<option value="Sfântu Gheorghe">Sfântu Gheorghe</option>
													<option value="Slobozia">Slobozia</option>
													<option value="Alexandria">Alexandria</option>
													<option value="Târgu Jiu">Târgu Jiu</option>
													<option value="Vaslui">Vaslui</option>
													<option value="Miercurea Ciuc">Miercurea Ciuc</option>
													<option value="Târgu Neamț">Târgu Neamț</option>
													<option value="Caracal">Caracal</option>
													<option value="Sighetu Marmației">Sighetu Marmației</option>
													<option value="Râmnicu Sărat">Râmnicu Sărat</option>
													<option value="Curtea de Argeș">Curtea de Argeș</option>
													<option value="Sebeș">Sebeș</option>
													<option value="Huși">Huși</option>
													<option value="Făgăraș">Făgăraș</option>
													<option value="Bârlad">Bârlad</option>
													<option value="Vulcan">Vulcan</option>
													<option value="Rădăuți">Rădăuți</option>
													<option value="Câmpina">Câmpina</option>
													<option value="Câmpulung">Câmpulung</option>
													<option value="Băilești">Băilești</option>
													<option value="Câmpulung Moldovenesc">Câmpulung Moldovenesc</option>
												</select>
												<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
											</div>
										</div>
										<div className="md:col-span-2">
											<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
												Address *
											</label>
											<textarea
												id="address"
												value={formData.address}
												onChange={(e) => handleInputChange("address", e.target.value)}
												rows={3}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter full address"
											/>
										</div>
									</div>
								</div>

								{/* Save Button */}
								<div className="pt-4">
									<button
										type="button"
										onClick={handleUpdateChanges}
										className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
									>
										Save Address Information
									</button>
								</div>
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
