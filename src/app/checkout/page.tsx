"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Info } from "lucide-react";
import { getCart, CartCookieItem } from "@/lib/cart";

type EntityType = "individual" | "company";

export default function CheckoutPage() {
	const [entityType, setEntityType] = useState<EntityType>("individual");
	const [cartItems, setCartItems] = useState<CartCookieItem[]>([]);
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

	// Load cart items on component mount
	useEffect(() => {
		const items = getCart();
		setCartItems(items);
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
			alert("Your cart is empty. Please add items before checkout.");
			return;
		}
		
		// Validate required contact fields
		if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
			alert("Please fill in all required contact fields (First Name, Last Name, Phone, Email)");
			return;
		}
		
		// Validate required address fields
		if (!formData.county || !formData.city || !formData.address) {
			alert("Please fill in all required address fields (County, City, Address)");
			return;
		}
		
		// Validate required fields based on entity type
		if (entityType === "company") {
			if (!formData.taxId || !formData.companyName) {
				alert("Please fill in all required company fields (Tax ID, Company Name)");
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
			
			alert(`Checkout Error: ${errorMessage}`);
		}
	};

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
									className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
									className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
									>
										<option value="">Choose a county...</option>
										<option value="bucharest">Bucharest</option>
										<option value="cluj">Cluj</option>
										<option value="timis">Timis</option>
										<option value="constanta">Constanta</option>
										<option value="brasov">Brasov</option>
										<option value="ilfov">Ilfov</option>
										<option value="dolj">Dolj</option>
										<option value="galati">Galati</option>
										<option value="arad">Arad</option>
										<option value="bihor">Bihor</option>
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
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
									>
										<option value="">Choose a city...</option>
										<option value="bucharest">Bucharest</option>
										<option value="cluj-napoca">Cluj-Napoca</option>
										<option value="timisoara">Timisoara</option>
										<option value="constanta">Constanta</option>
										<option value="brasov">Brasov</option>
										<option value="craiova">Craiova</option>
										<option value="galati">Galati</option>
										<option value="arad">Arad</option>
										<option value="oradea">Oradea</option>
										<option value="sibiu">Sibiu</option>
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
