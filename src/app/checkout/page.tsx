"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getCart, CartCookieItem } from "@/lib/cart";
import { authService } from "@/lib/auth";

type EntityType = "individual" | "company";

export default function CheckoutPage() {
	const [entityType, setEntityType] = useState<EntityType>("individual");
	const [cartItems, setCartItems] = useState<CartCookieItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		taxId: "",
		companyName: "",
		tradeRegisterNo: "",
		bank: "",
		iban: "",
		county: "",
		city: "",
		address: ""
	});

	// Load cart items and user data on component mount
	useEffect(() => {
		const loadData = async () => {
			// Load cart items
			const items = getCart();
			setCartItems(items);
			
			// Check if user is logged in and load their data
			if (authService.isAuthenticated()) {
				try {
					const userProfile = await authService.getUserProfile();
					
					// Split full_name into firstName and lastName
					const nameParts = userProfile.full_name.split(' ');
					const firstName = nameParts[0] || '';
					const lastName = nameParts.slice(1).join(' ') || '';
					
					// Update form data with user's saved information
					setFormData(prev => ({
						...prev,
						firstName: firstName,
						lastName: lastName,
						phone: userProfile.phone || '',
						email: userProfile.email || '',
						taxId: userProfile.tax_id || '',
						companyName: userProfile.company_name || '',
						tradeRegisterNo: userProfile.trade_register_no || '',
						bank: userProfile.bank_name || '',
						iban: userProfile.iban || '',
						county: userProfile.county || '',
						city: userProfile.city || '',
						address: userProfile.address || ''
					}));
					
					// Set entity type
					setEntityType(userProfile.entity_type as EntityType || "individual");
					
					// Show success toast
					toast.success("Address loaded", {
						description: "Your saved address information has been loaded automatically.",
						duration: 3000,
					});
				} catch (error) {
					console.error("Error loading user profile:", error);
					// Don't show error to user, just log it
				}
			}
			
			setLoading(false);
		};
		
		loadData();
	}, []);

	// Calculate totals
	const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0), [cartItems]);
	const tax = subtotal * 0.21;
	const total = subtotal + tax;

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Check if cart has items
		if (cartItems.length === 0) {
			toast.error("Your cart is empty", {
				description: "Please add items before proceeding to checkout.",
			});
			return;
		}
		
		// Validate required contact fields
		if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
			toast.error("Missing contact information", {
				description: "Please fill in all required contact fields (First Name, Last Name, Phone, Email)",
			});
			return;
		}
		
		// Validate required address fields
		if (!formData.county || !formData.city || !formData.address) {
			toast.error("Missing address information", {
				description: "Please fill in all required address fields (County, City, Address)",
			});
			return;
		}
		
		// Validate required fields based on entity type
		if (entityType === "company") {
			if (!formData.taxId || !formData.companyName) {
				toast.error("Missing company information", {
					description: "Please fill in all required company fields (Tax ID, Company Name)",
				});
				return;
			}
		}
		
		// Redirect to Stripe checkout
		redirectToStripeCheckout();
	};

	const redirectToStripeCheckout = async () => {
		try {
			console.log('=== CHECKOUT DEBUG ===');
			console.log('Original cartItems:', cartItems);
			console.log('Form data:', formData);
			console.log('Entity type:', entityType);
			console.log('Calculated totals:', { subtotal, tax, total });
			
			// Transform cart items for order creation endpoint
			const orderCartItems = cartItems.map(item => {
				const productId = parseInt(item.id);
				console.log(`Transforming cart item: id="${item.id}" -> parsed=${productId}`);
				
				if (isNaN(productId)) {
					throw new Error(`Invalid product ID: ${item.id}. Product ID must be a valid number.`);
				}
				
				return {
					id: productId,
					quantity: item.qty,
					variants: item.variants || null
				};
			});
			
			console.log('Transformed orderCartItems:', orderCartItems);

			// First create the order in our system
			const orderData = {
				customer_info: {
					customer_email: formData.email,
					customer_name: `${formData.firstName} ${formData.lastName}`,
					customer_phone: formData.phone,
					company_name: entityType === 'company' ? formData.companyName : undefined,
					tax_id: entityType === 'company' ? formData.taxId : undefined,
					trade_register_no: entityType === 'company' ? formData.tradeRegisterNo : undefined,
					bank_name: entityType === 'company' ? formData.bank : undefined,
					iban: entityType === 'company' ? formData.iban : undefined,
					shipping_address: {
						county: formData.county,
						city: formData.city,
						address: formData.address
					},
					billing_address: entityType === 'company' ? {
						county: formData.county,
						city: formData.city,
						address: formData.address
					} : undefined
				},
				cart_items: orderCartItems,
				subtotal: subtotal,
				tax_amount: tax,
				total_amount: total,
				currency: "RON"
			};
			
			console.log('Order data being sent:', orderData);

			// Create order
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			if (!apiBaseUrl) {
				throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable must be set');
			}
			
			const orderResponse = await fetch(`${apiBaseUrl}/api/v1/orders/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData),
			});
			
			console.log('Order response status:', orderResponse.status);
			console.log('Order response headers:', orderResponse.headers);

			if (!orderResponse.ok) {
				const errorText = await orderResponse.text();
				console.error('Order creation failed with status:', orderResponse.status);
				console.error('Error response:', errorText);
				throw new Error(`Failed to create order: ${orderResponse.status} - ${errorText}`);
			}

			const order = await orderResponse.json();
			console.log('Order created successfully:', order);

			// Transform cart items for Stripe endpoint
			const stripeCartItems = cartItems.map(item => ({
				id: item.id,
				name: item.name,
				price: item.price,
				qty: item.qty,
				variants: item.variants || null
			}));
			
			console.log('Stripe cart items:', stripeCartItems);

			const stripeRequestData = {
				cartItems: stripeCartItems,
				customerInfo: {
					entityType,
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
					email: formData.email,
					taxId: formData.taxId || undefined,
					companyName: formData.companyName || undefined,
					county: formData.county,
					city: formData.city,
					address: formData.address
				},
				total: total,
				orderId: order.id
			};
			
			console.log('Stripe request data:', stripeRequestData);

			// Create Stripe checkout session with order ID
			const response = await fetch(`${apiBaseUrl}/api/v1/stripe/create-checkout-session`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(stripeRequestData),
			});
			
			console.log('Stripe response status:', response.status);
			console.log('Stripe response headers:', response.headers);

			if (response.ok) {
				const responseData = await response.json();
				console.log('Stripe response data:', responseData);
				// Redirect to Stripe checkout
				window.location.href = responseData.url;
			} else {
				const errorText = await response.text();
				console.error('Stripe checkout failed with status:', response.status);
				console.error('Error response:', errorText);
				throw new Error(`Failed to create checkout session: ${response.status} - ${errorText}`);
			}
		} catch (error) {
			console.error('Error creating checkout session:', error);
			
			// Show detailed error message
			let errorMessage = 'Failed to proceed to checkout. Please try again.';
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}
			
			toast.error("Checkout failed", {
				description: errorMessage,
				duration: 5000,
			});
		}
	};

	if (loading) {
		return (
			<main className="min-h-screen font-sans">
				<div className="mx-auto max-w-7xl px-4 py-8">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading checkout information...</p>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen font-sans">
			<div className="mx-auto max-w-7xl px-4 py-8">
				<h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
				

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Left: Checkout Form */}
					<div className="lg:col-span-2">
						<form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
					{/* Entity Type Selection */}
					<div className="bg-white rounded-lg border border-black/10 p-6">
						<h2 className="text-lg font-semibold mb-4">Entity Type</h2>
						<div className="space-y-3">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="radio"
									name="entityType"
									value="individual"
									checked={entityType === "individual"}
									onChange={(e) => setEntityType(e.target.value as EntityType)}
									className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
								/>
								<span className="text-gray-900">Individual Person</span>
							</label>
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="radio"
									name="entityType"
									value="company"
									checked={entityType === "company"}
									onChange={(e) => setEntityType(e.target.value as EntityType)}
									className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
								/>
								<span className="text-gray-900">Legal Entity / Company</span>
							</label>
						</div>
					</div>

					{/* Personal Information */}
					<div className="bg-white rounded-lg border border-black/10 p-6">
						<h2 className="text-lg font-semibold mb-4">Personal Information</h2>
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
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
									placeholder="Enter last name"
								/>
							</div>
							<div>
								<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
									Phone Number *
								</label>
								<input
									type="tel"
									id="phone"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
									placeholder="Enter email address"
								/>
							</div>
						</div>
					</div>

					{/* Company Information - Only show when Legal Entity is selected */}
					{entityType === "company" && (
						<div className="bg-white rounded-lg border border-black/10 p-6">
							<h2 className="text-lg font-semibold mb-4">Company Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
										Tax ID *
									</label>
									<input
										type="text"
										id="taxId"
										value={formData.taxId}
										onChange={(e) => handleInputChange("taxId", e.target.value)}
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
										placeholder="Enter tax ID"
									/>
								</div>
								<div>
									<label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
										Company Name *
									</label>
									<input
										type="text"
										id="companyName"
										value={formData.companyName}
										onChange={(e) => handleInputChange("companyName", e.target.value)}
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
										placeholder="Enter company name"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
										placeholder="Enter trade register number"
									/>
								</div>
								<div>
									<label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
										Bank
									</label>
									<input
										type="text"
										id="bank"
										value={formData.bank}
										onChange={(e) => handleInputChange("bank", e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
										placeholder="Enter IBAN"
									/>
								</div>
							</div>
						</div>
					)}

					{/* Location Information */}
					<div className="bg-white rounded-lg border border-black/10 p-6">
						<h2 className="text-lg font-semibold mb-4">Location Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-2">
									County/District *
								</label>
								<div className="relative">
									<select
										id="county"
										value={formData.county}
										onChange={(e) => handleInputChange("county", e.target.value)}
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none"
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
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none"
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
						</div>
					</div>

					{/* Address */}
					<div className="bg-white rounded-lg border border-black/10 p-6">
						<h2 className="text-lg font-semibold mb-4">Address</h2>
						<div>
							<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
								Address *
							</label>
							<textarea
								id="address"
								value={formData.address}
								onChange={(e) => handleInputChange("address", e.target.value)}
								required
								rows={3}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
								placeholder="Enter your full address"
							/>
						</div>
					</div>

						</form>
					</div>

					{/* Right: Order Summary */}
					<div className="lg:col-span-1">
						<div className="rounded-lg border border-black/10 p-6">
							{/* Cart Items */}
							<div className="mb-6">
								<h3 className="text-lg font-semibold mb-4">Order Summary</h3>
								<div className="space-y-3">
									{cartItems.map((item) => (
										<div key={`${item.id}-${item.variants ? JSON.stringify(item.variants) : "no-variants"}`} className="flex justify-between text-sm">
											<div className="flex-1">
												<div className="font-medium">{item.name}</div>
												{item.variants && Object.entries(item.variants).map(([variantType, variant]) => (
													<div key={variantType} className="text-xs text-gray-600">
														{variantType}: {variant.value_en}
													</div>
												))}
												<div className="text-xs text-gray-500">Qty: {item.qty}</div>
											</div>
											<div className="font-medium self-start">{(item.price * item.qty).toFixed(2)} RON</div>
										</div>
									))}
								</div>
							</div>

							{/* Divider */}
							<div className="border-t border-black/10 mb-6"></div>

							{/* Price Summary */}
							<div className="mb-6 space-y-3">
								<div className="flex justify-between"><span className="text-foreground/70">Subtotal</span><span>{subtotal.toFixed(2)} RON</span></div>
								<div className="flex justify-between"><span className="text-foreground/70">Tax (21%)</span><span>+{tax.toFixed(2)} RON</span></div>
								<div className="border-t border-black/10 pt-3">
									<div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{total.toFixed(2)} RON</span></div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3">
								<button
									type="submit"
									form="checkout-form"
									className="h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
								>
									Proceed to Payment
								</button>
								<button
									type="button"
									onClick={() => window.history.back()}
									className="h-12 w-full rounded-lg border border-black/20 bg-white text-foreground font-semibold hover:bg-black/5"
								>
									Back to Cart
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
